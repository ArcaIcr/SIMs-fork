import logo from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";
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
    { name: "Chicken Time", img: "", price: 51, revenue: 255, qty: 5 },
    { name: "Double Chicken Time", img: "", price: 71, revenue: 213, qty: 3 },
  ],
  "HOTDOGS": [
    { name: "Chili Con Cheese Franks", img: "", price: 97, revenue: 97, qty: 1 },
    { name: "French Onion Franks", img: "", price: 95, revenue: 285, qty: 3 },
    { name: "Cheesydog", img: "", price: 50, revenue: 450, qty: 9 },
  ],
  "DRINKS": [
    { name: "CalamanTea Mix", img: "", price: 25, revenue: 100, qty: 4 },
    { name: "Iced Mocha", img: "", price: 26, revenue: 52, qty: 2 },
    { name: "Fruitwist Mix", img: "", price: 25, revenue: 0, qty: 0 },
    { name: "Iced Choco", img: "", price: 24, revenue: 14, qty: 14 },
    { name: "Hot Choco", img: "", price: 20, revenue: 120, qty: 6 },
    { name: "Iced Coffee", img: "", price: 24, revenue: 192, qty: 8 },
    { name: "Krazy Milktea", img: "", price: 41, revenue: 2, qty: 2 },
    { name: "Hot Mocha", img: "", price: 20, revenue: 0, qty: 0 },
    { name: "Hot Coffee", img: "", price: 18, revenue: 18, qty: 1 },
    { name: "Bottled Water", img: "", price: 16, revenue: 208, qty: 13 },
  ],
  "EXTRA": [
    { name: "Cheesy Carne Nachos", img: "", price: 52, revenue: 676, qty: 13 },
    { name: "Coleslaw", img: "", price: 13, revenue: 676, qty: 13 },
    { name: "Egg", img: "", price: 16, revenue: 676, qty: 13 },
    { name: "Supreme Cheese", img: "", price: 16, revenue: 676, qty: 13 },
  ],
};

import React, { useState } from "react";

export default function Sales() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  return (
    <div className="min-h-screen bg-[#fff3e0] p-8">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="bg-orange-100 rounded-full p-2 shadow hover:bg-orange-200">
          <span className="material-icons text-brown-700">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-brown-800">Sales</h1>
        <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center" onClick={() => navigate('/settings')}>
          <span className="material-icons text-brown-700">settings</span>
        </button>
      </div>
      <hr className="border-brown-200 mb-4" />
      <div className="flex justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded bg-orange-400 text-white font-semibold text-sm transition ${activeCategory === cat ? 'bg-orange-500' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {salesData[activeCategory].map((item, idx) => (
          <div key={idx} className="bg-orange-100 rounded-xl shadow flex flex-col gap-2 p-3 min-w-[200px]">
            <div className="flex justify-center items-center h-20">
              {/* <img src={item.img} alt={item.name} className="h-16 object-contain" /> */}
              <div className="h-16 w-24 bg-orange-200 rounded" />
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
