import { useState, useEffect } from 'react';
import SalesCategoryTabs from '../components/SalesCategoryTabs';
import SalesProductGrid from '../components/SalesProductGrid';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FirestoreService } from '../../../services/firestoreService';

// Import new images from the specified directory
import baconCheeseImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Bacon Cheese Burger.png';
import beefShawarmaImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Beef Shawarma Burger.png';
import blackPepperImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Black Pepper Burger.png';
import chimichurriImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Chimichurri Chicken Burger.png';
import veggieChickenImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/50_50 Veggie Chicken Burger.png'; // Corrected filename
import premiumSteakImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Premium Steak Burger.png';
import roastedSesameImg from '../../../assets/SDE Minute Burger Menu/Bigtime sandwiches/Roasted Sesame Burger.png';

import minuteImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Minute Burger.png';
import doubleMinuteImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Double Minute Burger.png';
import cheesyImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Cheesy Burger.png';
import doubleCheesyImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Double Cheesy Burger.png';
import chiliCheesyImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Chili Cheesy Burger.png';
import doubleChiliCheesyImg from '../../../assets/SDE Minute Burger Menu/Sulit Sandwiches/Double Chili Cheesy Burger.png';

import chickenImg from '../../../assets/SDE Minute Burger Menu/Chicken Time Sandwiches/Chicken Time.png';
import doubleChickenImg from '../../../assets/SDE Minute Burger Menu/Chicken Time Sandwiches/Double Chicken Time.png';

import chiliConImg from '../../../assets/SDE Minute Burger Menu/Hotdogs/Chili Con Cheese Franks.png';
import frenchOnionImg from '../../../assets/SDE Minute Burger Menu/Hotdogs/French Onion Franks.png';
import cheesydogImg from '../../../assets/SDE Minute Burger Menu/Hotdogs/Cheesydog.png';

import waterImg from '../../../assets/SDE Minute Burger Menu/Drinks/Water.png';
import milkteaImg from '../../../assets/SDE Minute Burger Menu/Drinks/Krazy Milktea.png'; // Updated filename
import icedmochaImg from '../../../assets/SDE Minute Burger Menu/Drinks/Iced Mocha.png';
import icedchocoImg from '../../../assets/SDE Minute Burger Menu/Drinks/Iced Choco.png';
import icedcoffeeImg from '../../../assets/SDE Minute Burger Menu/Drinks/Iced Coffee.png';
import hotmochaImg from '../../../assets/SDE Minute Burger Menu/Drinks/Hot Mocha.png';
import hotcoffeeImg from '../../../assets/SDE Minute Burger Menu/Drinks/Hot Coffee.png';
import hotchocoImg from '../../../assets/SDE Minute Burger Menu/Drinks/Hot Choco.png';
import fruitwistImg from '../../../assets/SDE Minute Burger Menu/Drinks/Fruitwist.png';
import calamanteaImg from '../../../assets/SDE Minute Burger Menu/Drinks/Calamantea.png';

import cheesycarneImg from '../../../assets/SDE Minute Burger Menu/Extra/Cheesy Carne Nachos.png';
import coleslawImg from '../../../assets/SDE Minute Burger Menu/Extra/Coleslaw.png';
import eggImg from '../../../assets/SDE Minute Burger Menu/Extra/Egg.png';
import cheeseImg from '../../../assets/SDE Minute Burger Menu/Extra/Supreme Cheese.png';

const CATEGORIES = [
  'BIGTIME SANDWICHES',
  'SULIT SANDWICHES',
  'CHICKEN TIME SANDWICHES',
  'HOTDOGS',
  'DRINKS',
  'EXTRA',
];

export const DUMMY_PRODUCTS = [
  // BIGTIME SANDWICHES
  { id: 1, name: 'Bacon Cheese Burger', revenue: 291, price: 97, count: 3, category: 'BIGTIME SANDWICHES', img: baconCheeseImg },
  { id: 2, name: 'Beef Shawarma Burger', revenue: 460, price: 92, count: 5, category: 'BIGTIME SANDWICHES', img: beefShawarmaImg },
  { id: 3, name: 'Black Pepper Burger', revenue: 180, price: 90, count: 2, category: 'BIGTIME SANDWICHES', img: blackPepperImg },
  { id: 4, name: 'Chimichurri Chicken Burger', revenue: 101, price: 101, count: 1, category: 'BIGTIME SANDWICHES', img: chimichurriImg },
  { id: 5, name: '50/50 Veggie Chicken Burger', revenue: 87, price: 87, count: 1, category: 'BIGTIME SANDWICHES', img: veggieChickenImg },
  { id: 6, name: 'Premium Steak Burger', revenue: 0, price: 142, count: 0, category: 'BIGTIME SANDWICHES', img: premiumSteakImg },
  { id: 7, name: 'Roasted Sesame Burger', revenue: 0, price: 95, count: 0, category: 'BIGTIME SANDWICHES', img: roastedSesameImg },

  // SULIT SANDWICHES
  { id: 8, name: 'Minute Burger', revenue: 714, price: 42, count: 17, category: 'SULIT SANDWICHES', img: minuteImg },
  { id: 9, name: 'Double Minute Burger', revenue: 260, price: 65, count: 4, category: 'SULIT SANDWICHES', img: doubleMinuteImg },
  { id: 10, name: 'Cheesy Burger', revenue: 780, price: 52, count: 15, category: 'SULIT SANDWICHES', img: cheesyImg },
  { id: 11, name: 'Double Cheesy Burger', revenue: 162, price: 81, count: 2, category: 'SULIT SANDWICHES', img: doubleCheesyImg },
  { id: 12, name: 'Chili Cheesy Burger', revenue: 52, price: 52, count: 1, category: 'SULIT SANDWICHES', img: chiliCheesyImg },
  { id: 13, name: 'Double Chili Cheesy Burger', revenue: 0, price: 81, count: 0, category: 'SULIT SANDWICHES', img: doubleChiliCheesyImg },

  // CHICKEN TIME SANDWICHES
  { id: 14, name: 'Chicken Time', revenue: 255, price: 51, count: 5, category: 'CHICKEN TIME SANDWICHES', img: chickenImg },
  { id: 15, name: 'Double Chicken Time', revenue: 213, price: 71, count: 3, category: 'CHICKEN TIME SANDWICHES', img: doubleChickenImg },

  // HOTDOGS
  { id: 16, name: 'Chili Con Cheese Franks', revenue: 97, price: 97, count: 1, category: 'HOTDOGS', img: chiliConImg },
  { id: 17, name: 'French Onion Franks', revenue: 285, price: 95, count: 3, category: 'HOTDOGS', img: frenchOnionImg },
  { id: 18, name: 'Cheesydog', revenue: 450, price: 50, count: 9, category: 'HOTDOGS', img: cheesydogImg },

  // DRINKS
  { id: 19, name: 'Water', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: waterImg },
  { id: 20, name: 'Milk Tea', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: milkteaImg },
  { id: 21, name: 'Iced Mocha', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedmochaImg },
  { id: 22, name: 'Iced Choco', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedchocoImg },
  { id: 23, name: 'Iced Coffee', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: icedcoffeeImg },
  { id: 24, name: 'Hot Mocha', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotmochaImg },
  { id: 25, name: 'Hot Coffee', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotcoffeeImg },
  { id: 26, name: 'Hot Choco', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: hotchocoImg },
  { id: 27, name: 'Fruitwist', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: fruitwistImg },
  { id: 28, name: 'Calamantea', revenue: 0, price: 0, count: 0, category: 'DRINKS', img: calamanteaImg },

  // EXTRA
  { id: 29, name: 'Cheesy Carne Nachos', revenue: 676, price: 52, count: 13, category: 'EXTRA', img: cheesycarneImg },
  { id: 30, name: 'Coleslaw', revenue: 676, price: 13, count: 13, category: 'EXTRA', img: coleslawImg },
  { id: 31, name: 'Egg', revenue: 676, price: 16, count: 13, category: 'EXTRA', img: eggImg },
  { id: 32, name: 'Supreme Cheese', revenue: 676, price: 16, count: 13, category: 'EXTRA', img: cheeseImg },
];

function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

const SalesPage = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [salesData, setSalesData] = useState<{ [productId: number]: { count: number; revenue: number } }>({});
  const navigate = useNavigate();

  // Fetch sales data for today on mount
  useEffect(() => {
    const fetchSales = async () => {
      const todayKey = getTodayKey();
      const salesDocs = await FirestoreService.getAll(`sales/${todayKey}/products`);
      const data: { [productId: number]: { count: number; revenue: number } } = {};
      salesDocs.forEach((doc: any) => {
        data[Number(doc.id)] = { count: doc.count, revenue: doc.revenue };
      });
      setSalesData(data);
    };
    fetchSales();
  }, []);

  // Handler to update sales in Firestore and local state
  const updateSales = async (productId: number, price: number, newCount: number) => {
    const todayKey = getTodayKey();
    const revenue = newCount * price;
    // Upsert the sales doc for this product for today
    const ok = await FirestoreService.setDoc(`sales/${todayKey}/products`, String(productId), { count: newCount, revenue });
    // Ensure the date document exists for history listing
    await FirestoreService.setDoc('sales', todayKey, { exists: true });
    if (!ok) {
      console.error('Failed to write sales data to Firestore for', productId, newCount, revenue);
      alert('Failed to save sales data. Please check your Firestore rules and network.');
    } else {
      console.log('Sales data saved:', { productId, newCount, revenue });
      setSalesData((prev: { [productId: number]: { count: number; revenue: number } }) => ({ ...prev, [productId]: { count: newCount, revenue } }));
    }
  };

  const filteredProducts = DUMMY_PRODUCTS.filter(
    (prod) => prod.category === selectedCategory
  ).map((prod) => ({
    ...prod,
    count: salesData[prod.id]?.count ?? 0,
    revenue: salesData[prod.id]?.revenue ?? 0,
  }));

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
        <SalesProductGrid products={filteredProducts} onUpdateSales={updateSales} />
      </div>
    </div>
  );
};

export default SalesPage; 