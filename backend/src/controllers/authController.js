import { customerLoginOrRegister, adminLogin } from '../services/authService.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/constants.js';

/**
 * Customer login/register controller
 * POST /api/auth/customer/login
 */
export const customerAuth = async (req, res) => {
  try {
    const { phone, name } = req.body;

    const result = await customerLoginOrRegister({ phone, name });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: result.isNewCustomer 
        ? 'Account created successfully' 
        : 'Login successful',
      data: {
        customer: result.customer,
        token: result.token
      }
    });
  } catch (error) {
    console.error('Customer auth error:', error);
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: error.message || 'Authentication failed'
      }
    });
  }
};

/**
 * Admin login controller
 * POST /api/auth/admin/login
 */
export const adminAuth = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await adminLogin({ username, password });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: result.admin,
        token: result.token
      }
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    
    // Handle invalid credentials specifically
    if (error.code === ERROR_CODES.INVALID_CREDENTIALS) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.INVALID_CREDENTIALS,
          message: 'Invalid username or password'
        }
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Verify token controller
 * POST /api/auth/verify
 */
export const verifyAuth = async (req, res) => {
  try {
    // If we reach here, the authenticate middleware has already verified the token
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Verification failed'
      }
    });
  }
};
