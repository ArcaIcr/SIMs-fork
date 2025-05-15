import React, { useState } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Buns', icon: '🍔' },
  { label: 'Patty', icon: '🥩' },
  { label: 'Drinks', icon: '🥤' },
  { label: 'Others', icon: '🍹' },
];

const INITIAL_ITEMS = [
  { id: 1, name: 'Value Buns', stock: 12, category: 'Buns', status: 'low' },
  { id: 2, name: 'DMB Buns', stock: 21, category: 'Buns', status: 'medium' },
  { id: 3, name: 'Chicken Buns', stock: 34, category: 'Buns', status: 'high' },
  { id: 4, name: 'Bacon Cheese Burger Buns', stock: 32, category: 'Buns', status: 'high' },
  { id: 5, name: 'Black Pepper Buns', stock: 34, category: 'Buns', status: 'high' },
  { id: 6, name: '50/50 Veggies Burger Buns', stock: 36, category: 'Buns', status: 'high' },
  { id: 7, name: 'DMB Buns', stock: 12, category: 'Buns', status: 'low' },
  // Add more items for other categories as needed
];

const statusColor = {
  low: 'bg-red-500',
  medium: 'bg-yellow-400',
  high: 'bg-green-500',
};

const InventoryPage = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].label);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const navigate = useNavigate();

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const handleStockChange = (id: number, delta: number) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <StaffNavbar user={user} />
      <div className="px-8 py-6">
        <div className="flex items-center mb-4">
          <button
            className="mr-4 p-2 rounded-full bg-[#FFF3E0] hover:bg-[#F9C97B] text-[#B77B2B] text-2xl shadow"
            onClick={() => navigate('/dashboard/staff')}
            aria-label="Back"
          >
            &#8592;
          </button>
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">Inventory</h1>
        </div>
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              className={`px-6 py-2 rounded-lg font-semibold border-none focus:outline-none transition-colors duration-200 text-xl flex items-center gap-2 ${selectedCategory === cat.label ? 'bg-[#F9C97B] text-white' : 'bg-[#FFF3E0] text-[#B77B2B]'}`}
              onClick={() => setSelectedCategory(cat.label)}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-6 h-6 rounded-full bg-red-500 inline-block"></span>
            <span className="w-6 h-6 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-6 h-6 rounded-full bg-green-500 inline-block"></span>
            <span className="ml-4 font-semibold text-[#B77B2B]">Items</span>
            <span className="ml-auto font-semibold text-[#B77B2B]">Stocks</span>
          </div>
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-[#FFD59A] rounded-xl px-4 py-2 mb-2">
              <div className="flex items-center gap-4">
                <span className={`w-10 h-6 rounded-full ${statusColor[item.status as 'low' | 'medium' | 'high']} inline-block`}></span>
                <span className="font-semibold text-[#B77B2B]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold" onClick={() => handleStockChange(item.id, -1)}>-</button>
                <span className="font-bold text-[#B77B2B] w-10 text-center">{item.stock} left</span>
                <button className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold" onClick={() => handleStockChange(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage; 