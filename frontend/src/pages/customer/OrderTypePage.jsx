import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Modal from '../../components/common/Modal';

const OrderTypePage = () => {
  const navigate = useNavigate();
  const { orderType, items, resetCartOnTypeChange, changeOrderType } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelection = (type) => {
    // If cart is empty or same type, proceed directly
    if (items.length === 0 || orderType === type) {
      resetCartOnTypeChange(type);
      navigate('/order/products');
      return;
    }

    // Cart has items and type is different - show confirmation
    setSelectedType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmTypeChange = () => {
    resetCartOnTypeChange(selectedType);
    setShowConfirmModal(false);
    navigate('/order/products');
  };

  const handleCancelTypeChange = () => {
    setShowConfirmModal(false);
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Select Order Type</h1>
          <p className="text-gray-600 mt-2">Choose how you'd like to place your order</p>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Step 1 of 4: Order Type</p>
        </div>
      </div>

      {/* Order Type Options */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Only Option */}
          <button
            onClick={() => handleTypeSelection('serviceOnly')}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-left border-2 border-transparent hover:border-green-500 focus:outline-none focus:border-green-500 min-h-[280px] flex flex-col min-w-[44px]"
          >
            <div className="flex-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Service Only</h2>
              <p className="text-gray-600 leading-relaxed">
                Bring your own raw materials (flour, spices, etc.) and we'll grind them to your preferred consistency. 
                You only pay for the grinding service.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Pay only grinding charges</p>
            </div>
          </button>

          {/* Buy + Grinding Option */}
          <button
            onClick={() => handleTypeSelection('buyAndService')}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8 text-left border-2 border-transparent hover:border-green-500 focus:outline-none focus:border-green-500 min-h-[280px] flex flex-col min-w-[44px]"
          >
            <div className="flex-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Buy + Grinding</h2>
              <p className="text-gray-600 leading-relaxed">
                Purchase raw materials from us and we'll grind them for you. 
                Convenient option when you need both quality ingredients and grinding service.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Pay for raw materials + grinding</p>
            </div>
          </button>
        </div>

        {/* Current Selection Indicator */}
        {orderType && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Current selection:</span>{' '}
              {orderType === 'serviceOnly' ? 'Service Only' : 'Buy + Grinding'}
              {items.length > 0 && ` (${items.length} item${items.length > 1 ? 's' : ''} in cart)`}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelTypeChange}
        onConfirm={handleConfirmTypeChange}
        title="Change Order Type?"
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
      >
        <p className="text-gray-700">
          You have items in your cart. Changing the order type will clear your current cart. 
          Do you want to continue?
        </p>
      </Modal>
    </div>
  );
};

export default OrderTypePage;
