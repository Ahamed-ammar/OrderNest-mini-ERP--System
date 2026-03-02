import express from 'express';
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  orderFiltersSchema
} from '../validators/orderValidator.js';

const router = express.Router();

// Customer-specific routes (must come before parameterized routes)
router.get(
  '/customer/orders',
  authenticate,
  getCustomerOrders
);

router.put(
  '/customer/orders/:id/cancel',
  authenticate,
  validateParams(orderIdSchema),
  cancelOrder
);

// Order creation route
router.post(
  '/',
  authenticate,
  validateBody(createOrderSchema),
  createOrder
);

// Admin routes for all orders
router.get(
  '/',
  authenticate,
  requireAdmin,
  validateQuery(orderFiltersSchema),
  getAllOrders
);

// Shared routes (customer and admin) - parameterized routes come last
router.get(
  '/:id',
  authenticate,
  validateParams(orderIdSchema),
  getOrderById
);

router.put(
  '/:id/status',
  authenticate,
  requireAdmin,
  validateParams(orderIdSchema),
  validateBody(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;
