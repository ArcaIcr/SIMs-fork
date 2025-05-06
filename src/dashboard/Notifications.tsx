import logo from "../assets/logo 1.png";
import { useNavigate } from "react-router-dom";

const notifications = [
  { read: false, text: "Hello Minute Burger, A delay has been reported in the delivery of your...", date: "Just now" },
  { read: true, text: "Hello Minute Burger, New stock of patties has been delivered to your ...", date: "Just now" },
  { read: false, text: "Hello Minute Burger, Other supplies (napkins, boxes, condiments) fro...", date: "05 May, 2025" },
  { read: true, text: "Hello Minute Burger, Supplier 2 will deliver additional items shortly. E...", date: "04 May, 2025" },
  { read: false, text: "Hello Minute Burger, Incoming buns from Panaderia 2. Make sure inv...", date: "04 May, 2025" },
  { read: false, text: "Hello Minute Burger, Panaderia 1 is delivering buns today, May 5, 202...", date: "04 May, 2025" },
  { read: false, text: "Hello Minute Burger, Drinks from Coffitea 1 will be dropped off this m...", date: "02 May, 2025" },
  { read: false, text: "Hello Minute Burger, Patty Shop 1 has confirmed delivery today. Ensu...", date: "02 May, 2025" },
  { read: false, text: "Hello Minute Burger, Patty Shop 3 is dispatching patties today. Kindly...", date: "01 May, 2025" },
];

export default function Notifications() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#fff7ea] border-r border-brown-100 flex flex-col items-center py-6">
        <img src={logo} alt="Logo" className="w-14 h-14 mb-4" />
        <div className="text-xl font-bold text-brown-800 mb-8">SIMS</div>
        <nav className="flex flex-col gap-5 w-full px-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-brown-700 text-lg font-semibold hover:text-orange-600 transition">
            <span className="material-icons">Dashboard</span> 
          </button>
          <button className="flex items-center gap-2 text-brown-700 text-lg font-semibold hover:text-orange-600 transition">
            <span className="material-icons">Inventory</span> 
          </button>
          <button className="flex items-center gap-2 text-brown-700 text-lg font-semibold hover:text-orange-600 transition">
            <span className="material-icons">Sales</span> 
          </button>
          <button className="flex items-center gap-2 text-brown-700 text-lg font-semibold hover:text-orange-600 transition">
            <span className="material-icons">Suppliers</span> 
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-[#fff7ea] p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="material-icons text-brown-700 text-3xl"></span>
            <h1 className="text-2xl font-bold text-brown-800">Notification</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center" onClick={() => navigate('/settings')}>
            <span className="material-icons text-brown-700">Settings</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow divide-y divide-brown-100">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-center px-6 py-4">
              <span className={`w-3 h-3 rounded-full mr-4 ${n.read ? 'bg-green-400' : 'bg-gray-400'}`}></span>
              <span className="flex-1 text-brown-800 text-sm truncate">{n.text}</span>
              <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{n.date}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
