import rateLimit from 'express-rate-limit';
import { RATE_LIMITS, ERROR_CODES } from '../config/constants.js';

/**
 * Rate limiter for login endpoints
 * 5 requests per 15 minutes
 */
export const loginLimiter = rateLimit({
  windowMs: RATE_LIMITS.LOGIN.WINDOW_MS,
  max: RATE_LIMITS.LOGIN.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Too many login attempts. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from counting
  skipSuccessfulRequests: false,
  // Skip failed requests from counting (set to false to count all attempts)
  skipFailedRequests: false
});

/**
 * Rate limiter for general API endpoints
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMITS.GENERAL.WINDOW_MS,
  max: RATE_LIMITS.GENERAL.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for admin endpoints
 * 50 requests per 15 minutes
 */
export const adminLimiter = rateLimit({
  windowMs: RATE_LIMITS.ADMIN.WINDOW_MS,
  max: RATE_LIMITS.ADMIN.MAX_REQUESTS,
  message: {
    success: false,
    error: {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
