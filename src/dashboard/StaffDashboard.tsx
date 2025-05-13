import logo from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";

const salesData = [
  { name: "Minute Burger", value: 17 },
  { name: "Cheesy Burger", value: 15 },
  { name: "Cheesydog", value: 9 },
  { name: "Beef Shawarma Burger", value: 5 },
  { name: "Chicken Time", value: 5 },
  { name: "Double Minute Burger", value: 4 },
];

const stockData = [
  { name: "Value Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
  { name: "Cheesy Buns", status: "LOW STOCK", color: "text-yellow-500", bar: "border-yellow-400" },
  { name: "Chicken Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
  { name: "DMB Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
];

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function StaffDashboard({ user }: { user: STAFF }) {
  const navigate = useNavigate();
  const [branchName, setBranchName] = useState<string>("");
  const [branchLoading, setBranchLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBranchName() {
      if (user.branch) {
        try {
          const branchDoc = await getDoc(doc(db, "branches", user.branch));
          if (branchDoc.exists()) {
            setBranchName(branchDoc.data().name || "");
          } else {
            setBranchName(user.branch); // fallback to ID
          }
        } catch {
          setBranchName(user.branch);
        }
      } else {
        setBranchName("");
      }
      setBranchLoading(false);
    }
    fetchBranchName();
  }, [user.branch]);

  return (
    <div className="min-h-screen bg-[#fdf6ec] p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="w-16 h-16 object-contain drop-shadow" />
          <div>
            <div className="text-2xl font-bold text-brown-800">Hello, {user.displayName || "Staff"}!</div>
            <div className="text-sm text-brown-600 font-medium">SIMS Staff | Shift: TThS 8AM - 4PM</div>
            <div className="text-sm text-brown-600 font-medium">
              {branchLoading ? "Loading branch..." : branchName || "Branch"}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-50 transition">
            <span className="material-icons text-brown-700 text-2xl">notifications</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:bg-orange-50 transition">
            <span className="material-icons text-brown-700 text-2xl">settings</span>
          </button>
        </div>
      </div>
      <hr className="border-brown-200 mb-8" />
      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
        <button className="flex-1 px-8 py-6 bg-white rounded-2xl shadow-md text-2xl font-semibold border border-gray-200 hover:bg-orange-50 transition">Inventory</button>
        <button className="flex-1 px-8 py-6 bg-white rounded-2xl shadow-md text-2xl font-semibold border border-gray-200 hover:bg-orange-50 transition">Sales</button>
        <button className="flex-1 px-8 py-6 bg-white rounded-2xl shadow-md text-2xl font-semibold border border-gray-200 hover:bg-orange-50 transition">Suppliers</button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Common Sales */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-brown-800 mb-4">Common Sales</div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {salesData.map((item, idx) => (
              <div key={item.name} className="mb-5">
                <div className="flex justify-between text-lg font-medium text-brown-800">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full mt-2 mb-1">
                  <div className="h-3 rounded-full bg-orange-400 transition-all" style={{ width: `${Math.min(item.value * 6, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stock Tracker */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-brown-800 mb-4">Stock Tracker</div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-orange-200">
            {stockData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between mb-4 last:mb-0 p-3 rounded-xl bg-orange-50 border-l-4 shadow-sm transition-all border-orange-300">
                <div className="flex flex-col">
                  <span className={`font-bold text-lg ${item.color}`}>{item.name}</span>
                  <span className="text-xs text-gray-500">Today, 7:14</span>
                </div>
                <span className={`font-semibold text-base ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
