import Order from '../models/Order.js';
import { ORDER_STATUS, DELIVERY_TYPES } from '../config/constants.js';

/**
 * Get the start and end of today in UTC
 */
const getTodayRange = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  return { startOfDay, endOfDay };
};

/**
 * Get the date range for the last N days
 */
const getLastNDaysRange = (days) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);
  
  return { startDate, endDate };
};

/**
 * Count orders for today
 */
export const countOrdersToday = async () => {
  const { startOfDay, endOfDay } = getTodayRange();
  
  const count = await Order.countDocuments({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
  
  return count;
};

/**
 * Calculate revenue for today
 */
export const calculateRevenueToday = async () => {
  const { startOfDay, endOfDay } = getTodayRange();
  
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: { $ne: ORDER_STATUS.CANCELLED }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalRevenue : 0;
};

/**
 * Count pending orders
 */
export const countPendingOrders = async () => {
  const count = await Order.countDocuments({
    status: ORDER_STATUS.PENDING
  });
  
  return count;
};

/**
 * Get order counts for last 7 days
 */
export const getOrderCountsLast7Days = async () => {
  const { startDate, endDate } = getLastNDaysRange(7);
  
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Create array with all 7 days, filling in zeros for days with no orders
  const orderCounts = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayData = result.find(r => r._id === dateString);
    orderCounts.push({
      date: dateString,
      count: dayData ? dayData.count : 0
    });
  }
  
  return orderCounts;
};

/**
 * Get revenue for last 7 days
 */
export const getRevenueLast7Days = async () => {
  const { startDate, endDate } = getLastNDaysRange(7);
  
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        status: { $ne: ORDER_STATUS.CANCELLED }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        revenue: { $sum: '$totalAmount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Create array with all 7 days, filling in zeros for days with no revenue
  const revenueData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayData = result.find(r => r._id === dateString);
    revenueData.push({
      date: dateString,
      revenue: dayData ? dayData.revenue : 0
    });
  }
  
  return revenueData;
};

/**
 * Calculate most ordered products
 */
export const getMostOrderedProducts = async (limit = 5) => {
  const result = await Order.aggregate([
    {
      $match: {
        status: { $ne: ORDER_STATUS.CANCELLED }
      }
    },
    {
      $unwind: '$items'
    },
    {
      $group: {
        _id: '$items.productId',
        productName: { $first: '$items.productName' },
        totalQuantity: { $sum: '$items.quantity' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { totalQuantity: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 0,
        productId: '$_id',
        productName: 1,
        totalQuantity: 1,
        orderCount: 1
      }
    }
  ]);
  
  return result;
};

/**
 * Calculate pickup vs delivery percentage
 */
export const getPickupVsDeliveryPercentage = async () => {
  const result = await Order.aggregate([
    {
      $match: {
        status: { $ne: ORDER_STATUS.CANCELLED }
      }
    },
    {
      $group: {
        _id: '$deliveryType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const totalOrders = result.reduce((sum, item) => sum + item.count, 0);
  
  if (totalOrders === 0) {
    return {
      pickup: 0,
      delivery: 0,
      total: 0
    };
  }
  
  const pickupCount = result.find(r => r._id === DELIVERY_TYPES.PICKUP)?.count || 0;
  const deliveryCount = result.find(r => r._id === DELIVERY_TYPES.DELIVERY)?.count || 0;
  
  return {
    pickup: Math.round((pickupCount / totalOrders) * 100),
    delivery: Math.round((deliveryCount / totalOrders) * 100),
    total: totalOrders,
    pickupCount,
    deliveryCount
  };
};

/**
 * Get revenue for a specific date range
 */
export const getRevenueByDateRange = async (startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end
        },
        status: { $ne: ORDER_STATUS.CANCELLED }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        revenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        revenue: 1,
        orderCount: 1
      }
    }
  ]);
  
  return result;
};
