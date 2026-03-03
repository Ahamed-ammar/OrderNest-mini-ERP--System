import express from 'express';
import {
  getCustomerProfile,
  updateCustomerProfile
} from '../controllers/customerController.js';
import {
  getCustomerOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validateBody,
  updateProfileSchema
} from '../validators/customerValidator.js';
import {
  validateParams,
  orderIdSchema
} from '../validators/orderValidator.js';

const router = express.Router();

// Customer profile routes
router.get(
  '/profile',
  authenticate,
  getCustomerProfile
);

router.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  updateCustomerProfile
);

// Customer order routes
router.get(
  '/orders',
  authenticate,
  getCustomerOrders
);

router.put(
  '/orders/:id/cancel',
  authenticate,
  validateParams(orderIdSchema),
  cancelOrder
);

export default router;
