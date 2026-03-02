import bcrypt from 'bcryptjs';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/jwtUtils.js';
import { USER_ROLES, ERROR_CODES } from '../config/constants.js';

/**
 * Customer login or register service
 * If phone exists, return existing customer
 * If phone doesn't exist, create new customer
 */
export const customerLoginOrRegister = async ({ phone, name }) => {
  try {
    // Check if customer exists
    let customer = await Customer.findOne({ phone });

    if (customer) {
      // Existing customer - login
      const token = generateToken({
        userId: customer._id.toString(),
        role: USER_ROLES.CUSTOMER
      });

      return {
        success: true,
        isNewCustomer: false,
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          streetType: customer.streetType,
          houseName: customer.houseName,
          doorNo: customer.doorNo,
          landmark: customer.landmark,
          role: customer.role
        },
        token
      };
    } else {
      // New customer - register
      // Use provided name or default to phone number
      const customerName = name || `Customer ${phone}`;
      
      customer = await Customer.create({
        name: customerName,
        phone
      });

      const token = generateToken({
        userId: customer._id.toString(),
        role: USER_ROLES.CUSTOMER
      });

      return {
        success: true,
        isNewCustomer: true,
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          role: customer.role
        },
        token
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (shouldn't happen with our logic, but just in case)
      throw new Error('Phone number already registered');
    }
    throw error;
  }
};

/**
 * Admin login service
 * Validates credentials and returns token
 */
export const adminLogin = async ({ username, password }) => {
  try {
    // Find admin by username
    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      const error = new Error('Invalid credentials');
      error.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Generate token
    const token = generateToken({
      userId: admin._id.toString(),
      role: USER_ROLES.ADMIN
    });

    return {
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      token
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Hash password using bcrypt
 * Used when creating or updating admin passwords
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
