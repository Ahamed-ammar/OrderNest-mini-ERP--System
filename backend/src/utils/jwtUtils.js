import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, USER_ROLES } from '../config/constants.js';

/**
 * Generate JWT token with role-based expiration
 * @param {Object} payload - Token payload containing userId and role
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role (customer or admin)
 * @returns {string} JWT token
 */
export const generateToken = ({ userId, role }) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Determine expiration based on role
  const expiresIn = role === USER_ROLES.ADMIN 
    ? JWT_EXPIRATION.ADMIN 
    : JWT_EXPIRATION.CUSTOMER;

  const token = jwt.sign(
    { 
      userId, 
      role 
    },
    secret,
    { expiresIn }
  );

  return token;
};

/**
 * Verify JWT token and return decoded payload
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};
