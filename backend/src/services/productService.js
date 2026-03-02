import Product from '../models/Product.js';
import { ERROR_CODES } from '../config/constants.js';

/**
 * Create a new product
 * @param {Object} productData - Product information
 * @returns {Promise<Object>} Created product
 */
export const createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    return product;
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (product name already exists)
      const duplicateError = new Error('Product with this name already exists');
      duplicateError.code = ERROR_CODES.VALIDATION_ERROR;
      throw duplicateError;
    }
    throw error;
  }
};

/**
 * Get all products (optionally filter by active status)
 * @param {Boolean} activeOnly - If true, return only active products
 * @returns {Promise<Array>} List of products
 */
export const getAllProducts = async (activeOnly = false) => {
  try {
    const filter = activeOnly ? { isActive: true } : {};
    const products = await Product.find(filter).sort({ name: 1 });
    return products;
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by ID
 * @param {String} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      const error = new Error('Product not found');
      error.code = ERROR_CODES.PRODUCT_NOT_FOUND;
      throw error;
    }
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid product ID format');
      castError.code = ERROR_CODES.VALIDATION_ERROR;
      throw castError;
    }
    throw error;
  }
};

/**
 * Update product information
 * @param {String} productId - Product ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = async (productId, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      const error = new Error('Product not found');
      error.code = ERROR_CODES.PRODUCT_NOT_FOUND;
      throw error;
    }
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid product ID format');
      castError.code = ERROR_CODES.VALIDATION_ERROR;
      throw castError;
    }
    if (error.code === 11000) {
      const duplicateError = new Error('Product with this name already exists');
      duplicateError.code = ERROR_CODES.VALIDATION_ERROR;
      throw duplicateError;
    }
    throw error;
  }
};

/**
 * Toggle product active status
 * @param {String} productId - Product ID
 * @returns {Promise<Object>} Updated product
 */
export const toggleProductStatus = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      const error = new Error('Product not found');
      error.code = ERROR_CODES.PRODUCT_NOT_FOUND;
      throw error;
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    return product;
  } catch (error) {
    if (error.name === 'CastError') {
      const castError = new Error('Invalid product ID format');
      castError.code = ERROR_CODES.VALIDATION_ERROR;
      throw castError;
    }
    throw error;
  }
};
