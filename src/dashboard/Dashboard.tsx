import logo from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";

const salesData = [
  { name: "Minute Burger", value: 17 },
  { name: "Cheesy Burger", value: 15 },
  { name: "Cheesydog", value: 9 },
  { name: "Beef Shawarma Burger", value: 5 },
];

const stockData = [
  { name: "Value Buns", status: "OUT OF STOCK", color: "text-red-600" },
  { name: "Cheesy Buns", status: "LOW STOCK", color: "text-yellow-500" },
  { name: "Chicken Buns", status: "OUT OF STOCK", color: "text-red-600" },
  { name: "DMB Buns", status: "OUT OF STOCK", color: "text-red-600" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#fff7ea] p-6 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
          <div>
            <div className="text-xl font-bold text-brown-800">Hello, Edther!</div>
            <div className="text-xs text-brown-600">SIMS Staff | Shift: TThS 6AM - 4PM</div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center" onClick={() => navigate('/notifications')}>
            <span className="material-icons text-brown-700">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center" onClick={() => navigate('/settings')}>
            <span className="material-icons text-brown-700">settings</span>
          </button>
        </div>
      </div>
      <hr className="border-brown-200 mb-4" />
      <div className="flex gap-6 mb-6">
        <button className="flex-1 bg-white rounded-2xl py-5 text-xl font-semibold shadow hover:shadow-lg transition">Inventory</button>
        <button className="flex-1 bg-white rounded-2xl py-5 text-xl font-semibold shadow hover:shadow-lg transition" onClick={() => navigate('/sales')}>Sales</button>
        <button className="flex-1 bg-white rounded-2xl py-5 text-xl font-semibold shadow hover:shadow-lg transition">
          Suppliers<br /><span className="text-base font-normal">(Refill)</span>
        </button>
        <button className="flex-1 bg-white rounded-2xl py-5 text-xl font-semibold shadow hover:shadow-lg transition" onClick={() => navigate('/about')}>About Us</button>
      </div>
      <div className="flex gap-6">
        {/* Statistics */}
        <div className="flex-1">
          <div className="text-xl font-bold mb-2 text-brown-800">Statistics</div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="text-base font-semibold mb-4 text-brown-700">Common Sales</div>
            {salesData.map((item, idx) => (
              <div key={item.name} className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1 mb-2">
                  <div className="h-2 rounded-full bg-orange-300" style={{ width: `${item.value * 5}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stock Tracker */}
        <div className="flex-1">
          <div className="text-xl font-bold mb-2 text-brown-800">Stock Tracker</div>
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="bg-orange-100 rounded-2xl p-4 shadow-inner">
              {stockData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className={`font-bold text-lg ${item.color}`}>{item.name}</span>
                    <span className="text-xs text-gray-500">Today, 7:14</span>
                  </div>
                  <span className={`font-semibold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
