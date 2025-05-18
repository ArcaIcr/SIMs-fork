export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#fff7ea] flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
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
}
