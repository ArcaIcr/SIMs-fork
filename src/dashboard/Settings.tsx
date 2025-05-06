import logo from "../assets/logo 1.png";
import edther_ducusin from "../assets/edther_ducusin.png"; 
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
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
        <button className="mt-auto mb-2 w-11/12 bg-orange-200 hover:bg-orange-300 text-brown-800 font-semibold rounded-xl py-2 text-lg transition-all" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#fff7ea] p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-brown-800">Settings/Profile</h1>
              <div className="text-xs text-brown-600">View your profile and personal information.</div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center" onClick={() => navigate('/notifications')}>
            <span className="material-icons text-brown-700">notifications</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 divide-y divide-brown-200">
          {/* Profile Section */}
          <section className="pb-6">
            <div className="font-bold text-lg mb-1">Profile</div>
            <div className="text-xs text-gray-500 mb-4">View your personal profile information, including your name, profile picture, and role within the organization.</div>
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-orange-50">
              <img src={edther_ducusin} alt="Edther Ducusin" className="w-16 h-16 rounded-lg object-cover border" />
              <div className="flex-1">
                <div className="font-semibold text-brown-800">Edther Ducusin</div>
                <div className="text-xs text-gray-500">Staff</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brown-800">TThS: 8AM - 4PM</div>
                <div className="text-xs text-gray-500">Shift Schedule</div>
              </div>
            </div>
          </section>

          {/* Personal Information Section */}
          <section className="py-6">
            <div className="font-bold text-lg mb-1">Personal Information</div>
            <div className="text-xs text-gray-500 mb-4">Manage your information details, including birthday, email address, and phone number, to ensure your account is up to date.</div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-brown-800">Birthday</div>
                <input type="text" value="January 1, 2005" className="w-full border rounded px-3 py-1 mt-1 bg-orange-50" readOnly />
              </div>
              <div>
                <div className="font-semibold text-brown-800">Phone Number</div>
                <input type="text" value="0917-456-7890" className="w-full border rounded px-3 py-1 mt-1 bg-orange-50" readOnly />
              </div>
              <div className="col-span-2">
                <div className="font-semibold text-brown-800">Email</div>
                <input type="text" value="edther@gmail.com" className="w-full border rounded px-3 py-1 mt-1 bg-orange-50" readOnly />
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="pt-6">
            <div className="font-bold text-lg mb-1">Account</div>
            <div className="text-xs text-gray-500 mb-4">Update your pin to secure your account.</div>
            <div className="w-1/2">
              <div className="font-semibold text-brown-800">6-pin Code</div>
              <input type="text" value="303030" className="w-full border rounded px-3 py-1 mt-1 bg-orange-50" readOnly />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
