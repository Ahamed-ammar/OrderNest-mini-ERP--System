import { ORDER_TYPES, BUSINESS_DAYS_FOR_ORDER } from '../config/constants.js';

/**
 * Calculate item total based on order type
 * @param {Object} item - Order item with quantity, rawMaterialPrice, grindingCharge
 * @param {String} orderType - 'serviceOnly' or 'buyAndService'
 * @returns {Number} - Item total
 */
export const calculateItemTotal = (item, orderType) => {
  const { quantity, rawMaterialPriceSnapshot, grindingChargeSnapshot } = item;
  
  if (orderType === ORDER_TYPES.SERVICE_ONLY) {
    // Service only: charge only for grinding
    return quantity * grindingChargeSnapshot;
  } else if (orderType === ORDER_TYPES.BUY_AND_SERVICE) {
    // Buy and service: charge for both raw material and grinding
    return quantity * (rawMaterialPriceSnapshot + grindingChargeSnapshot);
  }
  
  return 0;
};

/**
 * Calculate order grand total
 * @param {Array} items - Array of order items with itemTotal
 * @returns {Number} - Grand total
 */
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + item.itemTotal, 0);
};

/**
 * Create price snapshots from current product prices
 * @param {Object} product - Product object from database
 * @returns {Object} - Price snapshot object
 */
export const createPriceSnapshot = (product) => {
  return {
    rawMaterialPriceSnapshot: product.rawMaterialPricePerKg,
    grindingChargeSnapshot: product.grindingChargePerKg
  };
};

/**
 * Calculate estimated ready date (2 business days from order date)
 * @param {Date} orderDate - Order creation date
 * @returns {Date} - Estimated ready date
 */
export const calculateEstimatedReadyDate = (orderDate = new Date()) => {
  const readyDate = new Date(orderDate);
  let daysAdded = 0;
  
  while (daysAdded < BUSINESS_DAYS_FOR_ORDER) {
    readyDate.setDate(readyDate.getDate() + 1);
    // Skip Sundays (0) - assuming mill is closed on Sundays
    if (readyDate.getDay() !== 0) {
      daysAdded++;
    }
  }
  
  return readyDate;
};

/**
 * Validate status transition
 * @param {String} currentStatus - Current order status
 * @param {String} newStatus - New order status
 * @param {Object} validTransitions - Valid status transitions map
 * @returns {Boolean} - True if transition is valid
 */
export const isValidStatusTransition = (currentStatus, newStatus, validTransitions) => {
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};
