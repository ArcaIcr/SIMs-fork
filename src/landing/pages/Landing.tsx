import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo 1.png";
import burger from "../../assets/burger-removebg-preview.png";
import bg from "../../assets/bg.png";

const AboutUsOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
    <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
      <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
      <h2 className="text-xl font-bold text-brown-800 mb-4">About us: Smart Inventory Management System</h2>
      <p className="mb-6 text-brown-700">At Minute Burger, we are dedicated to maintaining high-quality standards while ensuring smooth operations in every branch. To support this commitment, we have developed the Smart Inventory Management System (SIMS) — an advanced solution designed to simplify and improve inventory management for all Minute Burger staff.</p>
      <h3 className="font-semibold text-brown-800 mb-2">Our Mission</h3>
      <p className="mb-6 text-brown-700">Our mission is to ensure that every Minute Burger outlet maintains optimal inventory levels, reduces waste, and prevents out of stock through the use of advanced technology. By implementing SIMS, we are able to enhance operational efficiency, reduce human errors, and guarantee that our products meet the highest standards of freshness and quality.</p>
      <h3 className="font-semibold text-brown-800 mb-2">Why SIMS?</h3>
      <p className="mb-6 text-brown-700">Managing inventory manually can be time-consuming and prone to errors. SIMS automates and streamlines this process, helping staff:</p>
      <ul className="mb-6 space-y-2">
        <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✅</span><span>Track Stock Levels in Real-Time – Easily monitor ingredient availability and receive automatic alerts when supplies run low.</span></li>
        <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✅</span><span>Reduce Waste and Errors – Minimize overstocking and understocking by ensuring accurate inventory counts.</span></li>
        <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✅</span><span>Simplify Restocking Process – Automated alerts ensure that supplies are replenished on time, preventing delays or shortages.</span></li>
        <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✅</span><span>Enhance Operational Efficiency – Spend less time on inventory management and focus more on providing excellent service.</span></li>
      </ul>
      <h4 className="font-semibold text-brown-800 mb-2">Why It Matters</h4>
      <p className="mb-6 text-brown-700">With SIMS, we not only improve inventory accuracy but also promote sustainability by minimizing food waste and optimizing resources. This system helps us meet growing customer demands while maintaining the exceptional quality that Minute Burger is known for.</p>
      <h3 className="font-semibold text-brown-800 mb-2">Our Commitment to You</h3>
      <p className="mb-2 text-brown-700">We understand that the success of Minute Burger relies on the dedication and hard work of our staff. By implementing SIMS, we are providing a tool that empowers you to work more efficiently, reduce stress, and contribute to the overall success of the business.</p>
      <p className="mb-2 text-brown-700">At Minute Burger, we are not just introducing technology — we are investing in making your work easier, faster, and more effective. With the Smart Inventory Management System, managing inventory becomes one less thing to worry about!</p>
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  return (  
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
      {/* Overlay for background blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden">
        {/* Left: Branding */}
        <div className="flex-1 flex flex-col justify-center items-start bg-white/80 p-10 md:p-16 gap-6">
          {/* Logo Image */}
          <div className="w-20 h-20 mb-6">
            <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-800 leading-tight">
            Smart Inventory<br />
            Management<br />
            System
          </h1>
          <p className="text-brown-700 text-xl font-medium mt-2">
            Doble sa Busog, Doble sa Sulit
          </p>
          <button
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-full px-8 py-2 shadow-md transition-all"
            onClick={() => setShowAbout(true)}
          >
            About us
          </button>
          {/* Food Image */}
          <div className="flex gap-4 mt-10">
            <img src={burger} alt="Burger" className="w-24 h-24 object-contain rounded-xl shadow-md bg-white" />
            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold">Food 2</div>
            <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-bold">Food 3</div>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center bg-orange-100/90 p-10 md:p-16">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Log in</h2>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input type="text" placeholder="Username" className="pl-10 pr-4 py-2 w-full bg-orange-50 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input type="password" placeholder="Password" className="pl-10 pr-4 py-2 w-full bg-orange-50 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md py-2 text-lg transition-all"
                onClick={() => navigate("/pin")}
              >
                Log in
              </button>
              <div className="flex flex-col gap-2 mt-2 text-xs text-gray-600 items-center">
                <span>Forgot your password? <a href="#" className="text-blue-800 font-semibold hover:underline">Click here</a> to reset your password</span>
                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" className="accent-orange-500" />
                  By continuing, you agree with our <a href="#" className="text-blue-800 font-semibold hover:underline">Terms and Conditions</a>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAbout && <AboutUsOverlay onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default Landing;