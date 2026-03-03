import express from 'express';
import {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  assignDeliveryStaff
} from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import {
  validateBody,
  validateParams,
  validateQuery,
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  orderFiltersSchema,
  assignStaffSchema
} from '../validators/orderValidator.js';

const router = express.Router();

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

router.put(
  '/:id/assign-staff',
  authenticate,
  requireAdmin,
  validateParams(orderIdSchema),
  validateBody(assignStaffSchema),
  assignDeliveryStaff
);

export default router;
