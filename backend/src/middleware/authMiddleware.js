import { verifyToken } from '../utils/jwtUtils.js';
import { ERROR_CODES, HTTP_STATUS, USER_ROLES } from '../config/constants.js';

/**
 * Middleware to verify JWT token from request headers
 * Attaches decoded user information to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'No token provided. Please authenticate.'
        }
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_TOKEN,
        message: error.message || 'Invalid or expired token'
      }
    });
  }
};

/**
 * Middleware to check if authenticated user has admin role
 * Must be used after authenticate middleware
 */
export const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required'
        }
      });
    }

    // Check if user has admin role
    if (req.user.role !== USER_ROLES.ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Access denied. Admin privileges required.'
        }
      });
    }

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Authorization check failed'
      }
    });
  }
};

/**
 * Middleware to check if authenticated user has customer role
 * Must be used after authenticate middleware
 */
export const requireCustomer = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required'
        }
      });
    }

    // Check if user has customer role
    if (req.user.role !== USER_ROLES.CUSTOMER) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Access denied. Customer access only.'
        }
      });
    }

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Authorization check failed'
      }
    });
  }
};
