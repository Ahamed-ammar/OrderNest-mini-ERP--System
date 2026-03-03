// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  READY: 'Ready',
  OUT_FOR_DELIVERY: 'OutForDelivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// Valid status transitions
export const VALID_STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.IN_PROGRESS, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.IN_PROGRESS]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: []
};

// Status display names
export const STATUS_DISPLAY_NAMES = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.IN_PROGRESS]: 'In Progress',
  [ORDER_STATUS.READY]: 'Ready',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

// Status colors for badges
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.READY]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]: 'bg-gray-100 text-gray-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// Delivery Types
export const DELIVERY_TYPES = {
  PICKUP: 'Pickup',
  DELIVERY: 'Delivery'
};

// Order Types
export const ORDER_TYPES = {
  SERVICE_ONLY: 'serviceOnly',
  BUY_AND_SERVICE: 'buyAndService'
};
