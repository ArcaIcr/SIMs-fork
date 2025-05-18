import React, { useState } from 'react';
import SalesCategoryTabs from '../components/SalesCategoryTabs';
import SalesProductGrid from '../components/SalesProductGrid';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import baconCheese from '../../../assets/bigtime-baconcheese.png';
import beefShawarma from '../../../assets/bigtime-beefshawarma.png';
import blackPepper from '../../../assets/bigtime-blackpepper.png';
import chimichurri from '../../../assets/bigtime-chimichurri.png';
import veggieChicken from '../../../assets/bigtime-veggiechicken.png';
import premiumSteak from '../../../assets/bigtime-premiumsteak.png';
import roastedSesame from '../../../assets/bigtime-roastedsesame.png';

import minute from '../../../assets/sulit-minute.png';
import doubleMinute from '../../../assets/sulit-doubleminute.png';
import cheesy from '../../../assets/sulit-cheesy.png';
import doubleCheesy from '../../../assets/sulit-doublecheesy.png';
import chiliCheesy from '../../../assets/sulit-chilicheesy.png';
import doubleChiliCheesy from '../../../assets/sulit-doublechilicheesy.png';

import chicken from '../../../assets/chicken-chicken.png';
import doubleChicken from '../../../assets/chicken-doublechicken.png';

import chiliCon from '../../../assets/hotdogs-chilicon.png';
import frenchOnion from '../../../assets/hotdogs-frenchonion.png';
import cheesydog from '../../../assets/hotdogs-cheesydog.png';

import water from '../../../assets/drinks-water.png';
import milktea from '../../../assets/drinks-milktea.png';
import icedmocha from '../../../assets/drinks-icedmocha.png';
import icedchoco from '../../../assets/drinks-icedchoco.png';
import icedcoffee from '../../../assets/drinks-icedcoffee.png';
import hotmocha from '../../../assets/drinks-hotmocha.png';
import hotcoffee from '../../../assets/drinks-hotcoffee.png';
import hotchoco from '../../../assets/drinks-hotchoco.png';
import fruitwist from '../../../assets/drinks-fruitwist.png';
import calamantea from '../../../assets/drinks-calamantea.png';

import cheesycarne from '../../../assets/extra-cheesycarne.png';
import coleslaw from '../../../assets/extra-coleslaw.png';
import egg from '../../../assets/extra-egg.png';
import cheese from '../../../assets/extra-cheese.png';

const CATEGORIES = [
  'BIGTIME SANDWICHES',
  'SULIT SANDWICHES',
  'CHICKEN TIME SANDWICHES',
  'HOTDOGS',
  'DRINKS',
  'EXTRA',
];

const DUMMY_PRODUCTS = [
  // BIGTIME SANDWICHES
  { id: 1, name: 'Bacon Cheese Burger', revenue: 291, price: 97, count: 3, category: 'BIGTIME SANDWICHES', img: baconCheese },
  { id: 2, name: 'Beef Shawarma Burger', revenue: 460, price: 92, count: 5, category: 'BIGTIME SANDWICHES', img: beefShawarma },
  { id: 3, name: 'Black Pepper Burger', revenue: 180, price: 90, count: 2, category: 'BIGTIME SANDWICHES', img: blackPepper },
  { id: 4, name: 'Chimichurri Chicken Burger', revenue: 101, price: 101, count: 1, category: 'BIGTIME SANDWICHES', img: chimichurri },
  { id: 5, name: '50/50 Veggie Chicken Burger', revenue: 87, price: 87, count: 1, category: 'BIGTIME SANDWICHES', img: veggieChicken },
  { id: 6, name: 'Premium Steak Burger', revenue: 0, price: 142, count: 0, category: 'BIGTIME SANDWICHES', img: premiumSteak },
  { id: 7, name: 'Roasted Sesame Burger', revenue: 0, price: 95, count: 0, category: 'BIGTIME SANDWICHES', img: roastedSesame },

  // SULIT SANDWICHES
  { id: 8, name: 'Minute Burger', revenue: 714, price: 42, count: 17, category: 'SULIT SANDWICHES', img: minute },
  { id: 9, name: 'Double Minute Burger', revenue: 260, price: 65, count: 4, category: 'SULIT SANDWICHES', img: doubleMinute },
  { id: 10, name: 'Cheesy Burger', revenue: 780, price: 52, count: 15, category: 'SULIT SANDWICHES', img: cheesy },
  { id: 11, name: 'Double Cheesy Burger', revenue: 162, price: 81, count: 2, category: 'SULIT SANDWICHES', img: doubleCheesy },
  { id: 12, name: 'Chili Cheesy Burger', revenue: 52, price: 52, count: 1, category: 'SULIT SANDWICHES', img: chiliCheesy },
  { id: 13, name: 'Double Chili Cheesy Burger', revenue: 0, price: 81, count: 0, category: 'SULIT SANDWICHES', img: doubleChiliCheesy },

  // CHICKEN TIME SANDWICHES
  { id: 14, name: 'Chicken Time', revenue: 255, price: 51, count: 5, category: 'CHICKEN TIME SANDWICHES', img: chicken },
  { id: 15, name: 'Double Chicken Time', revenue: 213, price: 71, count: 3, category: 'CHICKEN TIME SANDWICHES', img: doubleChicken },

  // HOTDOGS
  { id: 16, name: 'Chili Con Cheese Franks', revenue: 97, price: 97, count: 1, category: 'HOTDOGS', img: chiliCon },
  { id: 17, name: 'French Onion Franks', revenue: 285, price: 95, count: 3, category: 'HOTDOGS', img: frenchOnion },
  { id: 18, name: 'Cheesydog', revenue: 450, price: 50, count: 9, category: 'HOTDOGS', img: cheesydog },

  // DRINKS
  { id: 19, name: 'Water', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: water },
  { id: 20, name: 'Milk Tea', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: milktea },
  { id: 21, name: 'Iced Mocha', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedmocha },
  { id: 22, name: 'Iced Choco', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedchoco },
  { id: 23, name: 'Iced Coffee', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedcoffee },
  { id: 24, name: 'Hot Mocha', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotmocha },
  { id: 25, name: 'Hot Coffee', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotcoffee },
  { id: 26, name: 'Hot Choco', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotchoco },
  { id: 27, name: 'Fruitwist', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: fruitwist },
  { id: 28, name: 'Calamantea', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: calamantea },

  // EXTRA
  { id: 29, name: 'Cheesy Carne Nachos', revenue: 676, price: 52, count: 13, category: 'EXTRA', img: cheesycarne },
  { id: 30, name: 'Coleslaw', revenue: 676, price: 13, count: 13, category: 'EXTRA', img: coleslaw },
  { id: 31, name: 'Egg', revenue: 676, price: 16, count: 13, category: 'EXTRA', img: egg },
  { id: 32, name: 'Supreme Cheese', revenue: 676, price: 16, count: 13, category: 'EXTRA', img: cheese },
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