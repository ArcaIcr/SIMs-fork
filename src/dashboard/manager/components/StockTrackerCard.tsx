import React from 'react';

const StockTrackerCard: React.FC = () => {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-[#B77B2B] mb-4">Stock Tracker</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Items</span>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Low Stock Items</span>
          <span className="font-semibold text-red-500">0</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Out of Stock</span>
          <span className="font-semibold text-red-500">0</span>
        </div>
      </div>
    </div>
  );
};

export default StockTrackerCard; 