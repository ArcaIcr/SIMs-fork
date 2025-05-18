import React, { useState } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const SUPPLIER_CATEGORIES = [
  { label: 'Buns', icon: '🍔' },
  { label: 'Patty', icon: '🥩' },
  // Add more categories as needed
];

const SUPPLIERS = [
  { id: 1, name: 'Panaderia 1', phone: '0912-345-6789', email: 'panaderia1@gmail.com', category: 'Buns' },
  { id: 2, name: 'Panaderia 2', phone: '0912-345-6789', email: 'panaderia2@gmail.com', category: 'Buns' },
  { id: 3, name: 'Panaderia 3', phone: '0912-345-6789', email: 'panaderia3@gmail.com', category: 'Buns' },
  // Add more suppliers for other categories as needed
];

const SuppliersPage = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(SUPPLIER_CATEGORIES[0].label);
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">Suppliers</h1>
        </div>
        <div className="flex gap-2 mb-6">
          {SUPPLIER_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              className={`px-6 py-2 rounded-lg font-semibold border-none focus:outline-none transition-colors duration-200 text-xl flex items-center gap-2 ${selectedCategory === cat.label ? 'bg-[#F9C97B] text-white' : 'bg-[#FFF3E0] text-[#B77B2B]'}`}
              onClick={() => setSelectedCategory(cat.label)}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
        {SUPPLIER_CATEGORIES.map(cat => (
          <div key={cat.label} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold text-lg text-[#B77B2B]">{cat.label}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="grid grid-cols-12 px-4 py-2 border-b font-semibold text-[#B77B2B]">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Supplier Name</div>
                <div className="col-span-5">Contact</div>
                <div className="col-span-3 text-center"> </div>
              </div>
              {SUPPLIERS.filter(s => s.category === cat.label).map((supplier, idx) => (
                <div key={supplier.id} className="grid grid-cols-12 px-4 py-3 items-center border-b last:border-b-0 bg-[#FFD59A]">
                  <div className="col-span-1 font-bold">{idx + 1}</div>
                  <div className="col-span-3">{supplier.name}</div>
                  <div className="col-span-5 flex flex-col gap-1">
                    <span><i className="fa fa-phone mr-2"></i>{supplier.phone}</span>
                    <span><i className="fa fa-envelope mr-2"></i>{supplier.email}</span>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow">REQUEST</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersPage; 