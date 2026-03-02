import express from 'express';
import {
  getCustomerProfile,
  updateCustomerProfile
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validateBody,
  updateProfileSchema
} from '../validators/customerValidator.js';

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

export default router;
