import bcrypt from 'bcryptjs';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/jwtUtils.js';
import { USER_ROLES, ERROR_CODES } from '../config/constants.js';

/**
 * Customer registration service
 * Creates a new customer with username, email, and password
 */
export const customerRegister = async ({ username, email, password, name }) => {
  try {
    // Check if username already exists
    const existingUsername = await Customer.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      const error = new Error('Username already taken');
      error.code = ERROR_CODES.DUPLICATE_ENTRY;
      throw error;
    }

    // Check if email already exists
    const existingEmail = await Customer.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      const error = new Error('Email already registered');
      error.code = ERROR_CODES.DUPLICATE_ENTRY;
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new customer
    const customer = await Customer.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || username
    });

    // Generate token
    const token = generateToken({
      userId: customer._id.toString(),
      role: USER_ROLES.CUSTOMER
    });

    return {
      success: true,
      customer: {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        name: customer.name,
        role: customer.role
      },
      token
    };
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`);
    }
    throw error;
  }
};

/**
 * Customer login service
 * Validates credentials (username/email + password) and returns token
 */
export const customerLogin = async ({ usernameOrEmail, password }) => {
  try {
    // Find customer by username or email
    const customer = await Customer.findOne({
      $or: [
        { username: usernameOrEmail.toLowerCase() },
        { email: usernameOrEmail.toLowerCase() }
      ]
    }).select('+password');

    if (!customer) {
      const error = new Error('Invalid credentials');
      error.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw error;
    }

    // Generate token
    const token = generateToken({
      userId: customer._id.toString(),
      role: USER_ROLES.CUSTOMER
    });

    return {
      success: true,
      customer: {
        id: customer._id,
        username: customer.username,
        email: customer.email,
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
  } catch (error) {
    throw error;
  }
};

/**
 * Legacy: Customer login or register service (phone-based)
 * Keeping for backward compatibility if needed
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
          username: customer.username,
          email: customer.email,
          streetType: customer.streetType,
          houseName: customer.houseName,
          doorNo: customer.doorNo,
          landmark: customer.landmark,
          role: customer.role
        },
        token
      };
    } else {
      const error = new Error('Phone-based registration is deprecated. Please use signup with username, email, and password.');
      error.code = ERROR_CODES.INVALID_REQUEST;
      throw error;
    }
  } catch (error) {
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
