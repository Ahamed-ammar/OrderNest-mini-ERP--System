import Order from '../models/Order.js';
import Product from '../models/Product.js';
import {
  calculateItemTotal,
  calculateOrderTotal,
  createPriceSnapshot,
  calculateEstimatedReadyDate,
  isValidStatusTransition
} from '../services/orderService.js';
import {
  ERROR_CODES,
  HTTP_STATUS,
  ORDER_STATUS,
  VALID_STATUS_TRANSITIONS
} from '../config/constants.js';

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { orderType, items, deliveryAddress } = req.body;
    const customerId = req.user.userId;

    // Validate cart has items (already validated by Joi, but double-check)
    if (!items || items.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.EMPTY_CART,
          message: 'Cart is empty. Please add items before placing an order.'
        }
      });
    }

    // Fetch current product prices and create snapshots
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: {
            code: ERROR_CODES.PRODUCT_NOT_FOUND,
            message: `Product with ID ${item.productId} not found`
          }
        });
      }
      
      if (!product.isActive) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
          success: false,
          error: {
            code: ERROR_CODES.PRODUCT_INACTIVE,
            message: `Product "${product.name}" is currently unavailable`
          }
        });
      }
      
      // Create price snapshot
      const priceSnapshot = createPriceSnapshot(product);
      
      // Create order item with snapshot
      const orderItem = {
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        grindType: item.grindType,
        rawMaterialPriceSnapshot: priceSnapshot.rawMaterialPriceSnapshot,
        grindingChargeSnapshot: priceSnapshot.grindingChargeSnapshot,
        itemTotal: 0 // Will be calculated next
      };
      
      // Calculate item total
      orderItem.itemTotal = calculateItemTotal(orderItem, orderType);
      
      orderItems.push(orderItem);
    }

    // Calculate order grand total
    const totalAmount = calculateOrderTotal(orderItems);

    // Calculate estimated ready date
    const estimatedReadyDate = calculateEstimatedReadyDate();

    // Create order
    const order = new Order({
      customerId,
      orderType,
      items: orderItems,
      deliveryAddress,
      totalAmount,
      status: ORDER_STATUS.PENDING,
      estimatedReadyDate
    });

    await order.save();

    // Return order details
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: {
        orderId: order._id,
        orderType: order.orderType,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        estimatedReadyDate: order.estimatedReadyDate,
        createdAt: order.createdAt
      },
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to create order. Please try again.'
      }
    });
  }
};

/**
 * Get customer's order history
 * GET /api/customer/orders
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.userId;

    const orders = await Order.find({ customerId })
      .sort({ createdAt: -1 })
      .populate('deliveryStaffId', 'name phone');

    // Separate last 5 orders for prominent display
    const recentOrders = orders.slice(0, 5);
    const allOrders = orders;

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        recentOrders,
        allOrders
      }
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to fetch orders. Please try again.'
      }
    });
  }
};

/**
 * Get single order details
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const order = await Order.findById(id)
      .populate('customerId', 'name phone')
      .populate('deliveryStaffId', 'name phone');

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.ORDER_NOT_FOUND,
          message: 'Order not found'
        }
      });
    }

    // Check authorization: customer can only view their own orders
    if (userRole === 'customer' && order.customerId._id.toString() !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'You are not authorized to view this order'
        }
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to fetch order. Please try again.'
      }
    });
  }
};

/**
 * Get all orders with filters (Admin only)
 * GET /api/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, deliveryType, page = 1, limit = 20 } = req.query;

    // Build filter query
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    if (deliveryType) {
      filter.deliveryType = deliveryType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('customerId', 'name phone')
      .populate('deliveryStaffId', 'name phone');

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to fetch orders. Please try again.'
      }
    });
  }
};

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.ORDER_NOT_FOUND,
          message: 'Order not found'
        }
      });
    }

    // Validate status transition
    if (!isValidStatusTransition(order.status, newStatus, VALID_STATUS_TRANSITIONS)) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_STATUS_TRANSITION,
          message: `Cannot transition from ${order.status} to ${newStatus}`
        }
      });
    }

    // Update status
    order.status = newStatus;
    await order.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to update order status. Please try again.'
      }
    });
  }
};

/**
 * Cancel order (Customer only)
 * PUT /api/customer/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.userId;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.ORDER_NOT_FOUND,
          message: 'Order not found'
        }
      });
    }

    // Verify order belongs to customer
    if (order.customerId.toString() !== customerId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'You are not authorized to cancel this order'
        }
      });
    }

    // Validate order status is Pending
    if (order.status !== ORDER_STATUS.PENDING) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: {
          code: ERROR_CODES.CANNOT_CANCEL_ORDER,
          message: 'Only pending orders can be cancelled'
        }
      });
    }

    // Update status to Cancelled
    order.status = ORDER_STATUS.CANCELLED;
    await order.save();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to cancel order. Please try again.'
      }
    });
  }
};

/**
 * Assign delivery staff to order (Admin only)
 * PUT /api/orders/:id/assign-staff
 */
export const assignDeliveryStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStaffId } = req.body;

    // Import DeliveryStaff model
    const DeliveryStaff = (await import('../models/DeliveryStaff.js')).default;

    // Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.ORDER_NOT_FOUND,
          message: 'Order not found'
        }
      });
    }

    // Check if staff exists and is active
    const staff = await DeliveryStaff.findById(deliveryStaffId);
    if (!staff) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Delivery staff not found'
        }
      });
    }

    if (!staff.isActive) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: {
          code: ERROR_CODES.STAFF_INACTIVE,
          message: 'Cannot assign inactive delivery staff'
        }
      });
    }

    // Validate order status is appropriate for delivery assignment
    // Staff should be assigned when order is Ready or OutForDelivery
    const validStatusesForAssignment = [ORDER_STATUS.READY, ORDER_STATUS.OUT_FOR_DELIVERY];
    if (!validStatusesForAssignment.includes(order.status)) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `Cannot assign delivery staff to order with status ${order.status}. Order must be Ready or Out for Delivery.`
        }
      });
    }

    // Assign staff to order
    order.deliveryStaffId = deliveryStaffId;
    await order.save();

    // Populate staff details for response
    await order.populate('deliveryStaffId', 'name phone');

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: order,
      message: 'Delivery staff assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning delivery staff:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to assign delivery staff. Please try again.'
      }
    });
  }
};
