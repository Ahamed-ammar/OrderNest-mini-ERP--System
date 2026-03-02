import express from 'express';
import {
  getDeliveryStaff,
  addDeliveryStaff,
  updateStaff,
  toggleStaffStatus,
  getStaffDeliveryCount
} from '../controllers/deliveryStaffController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import {
  validateBody,
  validateParams,
  createDeliveryStaffSchema,
  updateDeliveryStaffSchema,
  staffIdSchema
} from '../validators/deliveryStaffValidator.js';

const router = express.Router();

// All delivery staff routes require admin authentication
router.use(authenticate, requireAdmin);

// Get all delivery staff
router.get('/', getDeliveryStaff);

// Create new delivery staff
router.post(
  '/',
  validateBody(createDeliveryStaffSchema),
  addDeliveryStaff
);

// Update delivery staff
router.put(
  '/:id',
  validateParams(staffIdSchema),
  validateBody(updateDeliveryStaffSchema),
  updateStaff
);

// Toggle staff active status
router.patch(
  '/:id/toggle',
  validateParams(staffIdSchema),
  toggleStaffStatus
);

// Get delivery count for staff
router.get(
  '/:id/deliveries',
  validateParams(staffIdSchema),
  getStaffDeliveryCount
);

export default router;
