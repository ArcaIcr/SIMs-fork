import React from 'react';

const salesData = [
  { name: 'Minute Burger', count: 17, percent: 85 },
  { name: 'Cheesy Burger', count: 15, percent: 75 },
  { name: 'Cheesydog', count: 9, percent: 45 },
  { name: 'Beef Shawarma Burger', count: 5, percent: 25 },
  { name: 'Chicken Time', count: 5, percent: 25 },
  { name: 'Double Minute Burger', count: 4, percent: 20 },
];

const CommonSalesCard: React.FC = () => (
  <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
    <div className="text-lg font-bold text-[#B77B2B] mb-4">Common Sales</div>
    <div className="flex flex-col gap-2">
      {salesData.map((item) => (
        <React.Fragment key={item.name}>
          <div className="flex justify-between items-center font-semibold text-[#B77B2B]">
            {item.name} <span>{item.count}</span>
          </div>
          <div className="w-full h-2 bg-[#FFE6A7] rounded mb-2">
            <div className="h-2 bg-[#F2B04A] rounded" style={{ width: `${item.percent}%` }}></div>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default CommonSalesCard; 