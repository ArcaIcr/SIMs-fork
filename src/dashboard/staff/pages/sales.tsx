import React, { useState } from 'react';
import SalesCategoryTabs from '../components/SalesCategoryTabs';
import SalesProductGrid from '../components/SalesProductGrid';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'BIGTIME SANDWICHES',
  'SULIT SANDWICHES',
  'CHICKEN TIME SANDWICHES',
  'HOTDOGS',
  'DRINKS',
  'EXTRA',
];

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Bacon Cheese Burger', revenue: 91, price: 97, count: 3, category: 'BIGTIME SANDWICHES', img: '/img/bacon.png' },
  { id: 2, name: 'Beef Shawarma Burger', revenue: 60, price: 92, count: 5, category: 'BIGTIME SANDWICHES', img: '/img/shawarma.png' },
  { id: 3, name: 'Black Pepper Burger', revenue: 180, price: 90, count: 2, category: 'BIGTIME SANDWICHES', img: '/img/pepper.png' },
  { id: 4, name: 'Chimichurri Chicken Burger', revenue: 101, price: 101, count: 1, category: 'SULIT SANDWICHES', img: '/img/chimi.png' },
  { id: 5, name: '50/50 Veggie Chicken Burger', revenue: 87, price: 87, count: 1, category: 'SULIT SANDWICHES', img: '/img/veggie.png' },
  { id: 6, name: 'Premium Steak Burger', revenue: 142, price: 142, count: 2, category: 'BIGTIME SANDWICHES', img: '/img/steak.png' },
  { id: 7, name: 'Roasted Sesame Burger', revenue: 95, price: 95, count: 0, category: 'SULIT SANDWICHES', img: '/img/sesame.png' },
];

const SalesPage = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const navigate = useNavigate();

  const filteredProducts = DUMMY_PRODUCTS.filter(
    (prod) => prod.category === selectedCategory
  );

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
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">Sales</h1>
        </div>
        <SalesCategoryTabs
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <SalesProductGrid products={filteredProducts} />
      </div>
    </div>
  );
};

export default SalesPage; 