import express from 'express';
import { customerRegisterController, customerLoginController, customerAuth, adminAuth, verifyAuth } from '../controllers/authController.js';
import { validate, customerRegisterSchema, customerLoginSchema, customerPhoneLoginSchema, adminLoginSchema } from '../validators/authValidator.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/auth/customer/register
 * @desc    Customer registration with username, email, and password
 * @access  Public
 */
router.post('/customer/register', loginLimiter, validate(customerRegisterSchema), customerRegisterController);

/**
 * @route   POST /api/auth/customer/login
 * @desc    Customer login with username/email and password
 * @access  Public
 */
router.post('/customer/login', loginLimiter, validate(customerLoginSchema), customerLoginController);

/**
 * @route   POST /api/auth/customer/login-phone (Legacy)
 * @desc    Customer login or register by phone number
 * @access  Public
 */
router.post('/customer/login-phone', loginLimiter, validate(customerPhoneLoginSchema), customerAuth);

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
