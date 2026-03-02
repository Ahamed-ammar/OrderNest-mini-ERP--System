import React from 'react';

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h1>
        <p className="text-gray-600 mt-2">Your order has been received</p>
      </div>
    </div>
  );
};

export default SuccessPage;
