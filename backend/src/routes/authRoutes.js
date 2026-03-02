import express from 'express';
import { customerAuth, adminAuth, verifyAuth } from '../controllers/authController.js';
import { validate, customerLoginSchema, adminLoginSchema } from '../validators/authValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/auth/customer/login
 * @desc    Customer login or register by phone number
 * @access  Public
 */
router.post('/customer/login', loginLimiter, validate(customerLoginSchema), customerAuth);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login with username and password
 * @access  Public
 * @note    Rate limited to prevent brute force attacks
 */
router.post('/admin/login', loginLimiter, validate(adminLoginSchema), adminAuth);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify JWT token validity
 * @access  Protected
 */
router.post('/verify', authenticate, verifyAuth);

export default router;
