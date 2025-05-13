import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from 'lucide-react';
import { Settings } from 'lucide-react';
import bigtime_baconcheese from "../assets/bigtime-baconcheese.png";
import bigtime_beefshawarma from "../assets/bigtime-beefshawarma.png";
import bigtime_blackpepper from "../assets/bigtime-blackpepper.png";
import bigtime_chimichurri from "../assets/bigtime-chimichurri.png";
import bigtime_veggiechicken from "../assets/bigtime-veggiechicken.png";
import bigtime_premiumsteak from "../assets/bigtime-premiumsteak.png";
import bigtime_roastedsesame from "../assets/bigtime-roastedsesame.png";
import sulit_minute from "../assets/sulit-minute.png";
import sulit_doubleminute from "../assets/sulit-doubleminute.png";
import sulit_cheesy from "../assets/sulit-cheesy.png";
import sulit_doublecheesy from "../assets/sulit-doublecheesy.png";
import sulit_chilicheesy from "../assets/sulit-chilicheesy.png";
import sulit_doublechilicheesy from "../assets/sulit-doublechilicheesy.png";
import chicken_chicken from "../assets/chicken-chicken.png";
import chicken_chicken_double from "../assets/chicken-doublechicken.png";
import hotdogs_chili from "../assets/hotdogs-chilicon.png";
import hotdogs_frenchonion from "../assets/hotdogs-frenchonion.png";
import hotdogs_cheesydog from "../assets/hotdogs-cheesydog.png";
import drinks_calamantea from "../assets/drinks-calamantea.png";
import drinks_icedmocha from "../assets/drinks-icedmocha.png";
import drinks_fruitwist from "../assets/drinks-fruitwist.png";
import drinks_icedchoco from "../assets/drinks-icedchoco.png";
import drinks_hotchoco from "../assets/drinks-hotchoco.png";
import drinks_icedcoffee from "../assets/drinks-icedcoffee.png";
import drinks_krazy from "../assets/drinks-milktea.png";
import drinks_hotmocha from "../assets/drinks-hotmocha.png";
import drinks_hotcoffee from "../assets/drinks-hotcoffee.png";
import drinks_bottledwater from "../assets/drinks-water.png";
import extra_cheesynachos from "../assets/extra-cheesycarne.png";
import extra_coleslaw from "../assets/extra-coleslaw.png";
import extra_egg from "../assets/extra-egg.png";
import extra_supreme from "../assets/extra-cheese.png";

const categories = [
  "BIGTIME SANDWICHES",
  "SULIT SANDWICHES",
  "CHICKEN TIME SANDWICHES",
  "HOTDOGS",
  "DRINKS",
  "EXTRA",
] as const;

type Category = typeof categories[number];

type Product = {
  name: string;
  img: string;
  price: number;
  revenue: number;
  qty: number;
};

const salesData: Record<Category, Product[]> = {
  "BIGTIME SANDWICHES": [
    { name: "Bacon Cheese Burger", img: bigtime_baconcheese, price: 97, revenue: 291, qty: 3 },
    { name: "Beef Shawarma Burger", img: bigtime_beefshawarma, price: 92, revenue: 460, qty: 5 },
    { name: "Black Pepper Burger", img: bigtime_blackpepper, price: 90, revenue: 180, qty: 2 },
    { name: "Chimichuri Chicken Burger", img: bigtime_chimichurri, price: 101, revenue: 101, qty: 1 },
    { name: "50/50 Veggie Chicken Burger", img: bigtime_veggiechicken, price: 87, revenue: 87, qty: 1 },
    { name: "Premium Steak Burger", img: bigtime_premiumsteak, price: 142, revenue: 0, qty: 0 },
    { name: "Roasted Sesame Burger", img: bigtime_roastedsesame, price: 95, revenue: 0, qty: 0 },
  ],
  "SULIT SANDWICHES": [
    { name: "Minute Burger", img: sulit_minute, price: 42, revenue: 714, qty: 17 },
    { name: "Double Minute Burger", img: sulit_doubleminute, price: 65, revenue: 260, qty: 4 },
    { name: "Cheesy Burger", img: sulit_cheesy, price: 52, revenue: 780, qty: 15 },
    { name: "Double Cheesy Burger", img: sulit_doublecheesy, price: 81, revenue: 162, qty: 2 },
    { name: "Chili Cheesy Burger", img: sulit_chilicheesy, price: 52, revenue: 92, qty: 1 },
    { name: "Double Chili Cheesy Burger", img: sulit_doublechilicheesy, price: 81, revenue: 0, qty: 0 },
  ],
  "CHICKEN TIME SANDWICHES": [
    { name: "Chicken Time", img: chicken_chicken, price: 51, revenue: 255, qty: 5 },
    { name: "Double Chicken Time", img: chicken_chicken_double, price: 71, revenue: 213, qty: 3 },
  ],
  "HOTDOGS": [
    { name: "Chili Con Cheese Franks", img: hotdogs_chili, price: 97, revenue: 97, qty: 1 },
    { name: "French Onion Franks", img: hotdogs_frenchonion, price: 95, revenue: 285, qty: 3 },
    { name: "Cheesydog", img: hotdogs_cheesydog, price: 50, revenue: 450, qty: 9 },
  ],
  "DRINKS": [
    { name: "CalamanTea Mix", img: drinks_calamantea, price: 25, revenue: 100, qty: 4 },
    { name: "Iced Mocha", img: drinks_icedmocha, price: 26, revenue: 52, qty: 2 },
    { name: "Fruitwist Mix", img: drinks_fruitwist, price: 25, revenue: 0, qty: 0 },
    { name: "Iced Choco", img: drinks_icedchoco, price: 24, revenue: 14, qty: 14 },
    { name: "Hot Choco", img: drinks_hotchoco, price: 20, revenue: 120, qty: 6 },
    { name: "Iced Coffee", img: drinks_icedcoffee, price: 24, revenue: 192, qty: 8 },
    { name: "Krazy Milktea", img: drinks_krazy, price: 41, revenue: 2, qty: 2 },
    { name: "Hot Mocha", img: drinks_hotmocha, price: 20, revenue: 0, qty: 0 },
    { name: "Hot Coffee", img: drinks_hotcoffee, price: 18, revenue: 18, qty: 1 },
    { name: "Bottled Water", img: drinks_bottledwater, price: 16, revenue: 208, qty: 13 },
  ],
  "EXTRA": [
    { name: "Cheesy Carne Nachos", img: extra_cheesynachos, price: 52, revenue: 676, qty: 13 },
    { name: "Coleslaw", img: extra_coleslaw, price: 13, revenue: 676, qty: 13 },
    { name: "Egg", img: extra_egg, price: 16, revenue: 676, qty: 13 },
    { name: "Supreme Cheese", img: extra_supreme, price: 16, revenue: 676, qty: 13 },
  ],
};

export default function Sales() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  return (
    <div className="min-h-screen bg-[#fff3e0] p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100">
          <ArrowLeftIcon className="text-brown-700" />
        </button>
        <h1 className="text-2xl font-bold text-brown-800">Sales</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100" onClick={() => navigate('/settings')}>
          <Settings className="text-brown-700" />
        </button>
      </div>
      <div className="mb-6">
        {/* Mobile: Dropdown for small screens */}
        <div className="sm:hidden relative">
          <select 
            className="w-full p-2 rounded-md border border-orange-300 bg-white text-brown-800 font-medium text-sm appearance-none pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as Category)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Desktop: Tabs for larger screens */}
        <div className="hidden sm:flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-white text-orange-500 border border-orange-200 hover:bg-orange-50'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {salesData[activeCategory].map((item, idx) => (
          <div key={idx} className="bg-orange-100 rounded-xl shadow flex flex-col gap-2 p-3 min-w-[200px]">
            <div className="flex justify-center items-center h-20">
              <img src={item.img} alt={item.name} className="h-16 object-contain" />
            </div>
            <div className="font-bold text-brown-800 text-sm">{item.name}</div>
            <div className="text-xs text-gray-500 mb-1">Total Revenue: ₱{item.revenue}</div>
            <div className="flex items-center justify-between">
              <span className="text-orange-600 font-bold">₱ {item.price}</span>
              <div className="flex items-center gap-1">
                <button className="bg-orange-300 text-white rounded-full w-6 h-6 flex items-center justify-center">-</button>
                <span className="font-semibold text-brown-800">{item.qty}</span>
                <button className="bg-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
