import DeliveryStaff from '../models/DeliveryStaff.js';
import Order from '../models/Order.js';

/**
 * Create a new delivery staff member
 * @param {Object} staffData - Staff data (name, phone)
 * @returns {Promise<Object>} - Created staff member
 */
export const createDeliveryStaff = async (staffData) => {
  const staff = new DeliveryStaff(staffData);
  await staff.save();
  return staff;
};

/**
 * Get all delivery staff members
 * @param {Object} filter - Optional filter (e.g., { isActive: true })
 * @returns {Promise<Array>} - Array of staff members
 */
export const getAllDeliveryStaff = async (filter = {}) => {
  return await DeliveryStaff.find(filter).sort({ createdAt: -1 });
};

/**
 * Get delivery staff by ID
 * @param {String} staffId - Staff ID
 * @returns {Promise<Object|null>} - Staff member or null
 */
export const getDeliveryStaffById = async (staffId) => {
  return await DeliveryStaff.findById(staffId);
};

/**
 * Update delivery staff information
 * @param {String} staffId - Staff ID
 * @param {Object} updateData - Data to update (name, phone)
 * @returns {Promise<Object|null>} - Updated staff member or null
 */
export const updateDeliveryStaff = async (staffId, updateData) => {
  return await DeliveryStaff.findByIdAndUpdate(
    staffId,
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Toggle delivery staff active status
 * @param {String} staffId - Staff ID
 * @returns {Promise<Object|null>} - Updated staff member or null
 */
export const toggleDeliveryStaffStatus = async (staffId) => {
  const staff = await DeliveryStaff.findById(staffId);
  if (!staff) {
    return null;
  }
  
  staff.isActive = !staff.isActive;
  await staff.save();
  return staff;
};

/**
 * Count deliveries assigned to a staff member
 * @param {String} staffId - Staff ID
 * @returns {Promise<Number>} - Count of deliveries
 */
export const countStaffDeliveries = async (staffId) => {
  return await Order.countDocuments({ deliveryStaffId: staffId });
};
