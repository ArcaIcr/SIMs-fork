import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo 1.png";
import burger from "../../assets/burger-removebg-preview.png";
import bg from "../../assets/bg.png";
import LoginForm from '../components/LoginForm';

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

const TermsOverlay = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
    <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
      <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
      <h2 className="text-xl font-bold text-brown-800 mb-4">Terms and Conditions: Smart Inventory Management System</h2>
      <p className="mb-6 text-brown-700">Please read these Terms and Conditions ("Terms") carefully before using the Smart Inventory Management system ("the System") developed for the purpose of optimizing inventory tracking and management. These Terms constitute a legally binding agreement between you ("Minute Burger Staff") and our development team. By using the System, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the System.</p>
      <h3 className="font-semibold text-brown-800 mb-2">1. Objective</h3>
      <p className="mb-6 text-brown-700">The main objective of the Smart Inventory Management system is to provide an efficient and user-friendly platform for tracking, organizing, and managing inventory. The System is designed to help Minute Burger staff monitor stock levels, reduce waste, and optimize supply chain operations.</p>
      <h3 className="font-semibold text-brown-800 mb-2">2. User Responsibilities</h3>
      <h3 className="font-semibold text-brown-800 mb-2">2.1. Eligibility</h3>
      <p className="mb-6 text-brown-700">The System is intended for use by Minute Burger staff members responsible for inventory management. By using the System, you represent and warrant that you have the legal authority to enter into this agreement on behalf of Minute Burger.</p>
      <h3 className="font-semibold text-brown-800 mb-2">2.2. Account Registration</h3>
      <p className="mb-6 text-brown-700">In order to use the System, you may need to create an account. You agree to provide accurate, complete, and up-to-date information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      <h3 className="font-semibold text-brown-800 mb-2">2.3. Responsible Use</h3>
      <p className="mb-6 text-brown-700">You agree to use the System responsibly and in compliance with all applicable laws and regulations. You will not use the System for any illegal, unauthorized, or unethical purposes. You are solely responsible for any content or information you provide through the System.</p>
      <h3 className="font-semibold text-brown-800 mb-2">3. System Features</h3>
      <h4 className="font-semibold text-brown-800 mb-2">3.1. Inventory Management Features</h4>
      <p className="mb-6 text-brown-700">The Smart Inventory Management system includes features such as real-time stock tracking, automated alerts for low inventory, reporting tools, and analytics to enhance operational efficiency.</p>
      <h4 className="font-semibold text-brown-800 mb-2">3.2. Availability</h4>
      <p className="mb-6 text-brown-700">The developers will make reasonable efforts to ensure the availability of the System. However, there may be instances when the System may be temporarily unavailable due to maintenance, upgrades, or other technical issues. The developers do not guarantee uninterrupted access to the System.</p>
      <h3 className="font-semibold text-brown-800 mb-2">4. Data Privacy and Security</h3>
      <h4 className="font-semibold text-brown-800 mb-2">4.1. Data Collection and Use</h4>
      <p className="mb-6 text-brown-700">By using the System, you acknowledge and agree that the developers may collect and use certain personal and inventory-related data as outlined in the Privacy Policy. The developers will handle your data in accordance with applicable data protection laws and regulations.</p>
      <h4 className="font-semibold text-brown-800 mb-2">4.2. Data Security</h4>
      <p className="mb-6 text-brown-700">The developers employ reasonable measures to protect the security of your personal and business data. However, no method of transmission or electronic storage is completely secure. You acknowledge that the developers cannot guarantee the absolute security of your data transmitted through the System.</p>
      <h3 className="font-semibold text-brown-800 mb-2">5. Intellectual Property</h3>
      <h4 className="font-semibold text-brown-800 mb-2">5.1. Ownership</h4>
      <p className="mb-6 text-brown-700">The Smart Inventory Management system, including all content and intellectual property rights, is owned by the developers. You acknowledge that the developers retain all rights, title, and interest in the System.</p>
      <h4 className="font-semibold text-brown-800 mb-2">5.2. Limited License</h4>
      <p className="mb-6 text-brown-700">The developers grant you a limited, non-exclusive, non-transferable license to use the System solely for inventory management purposes within Minute Burger operations. You may not modify, reproduce, distribute, or create derivative works based on the System without prior authorization.</p>
      <h3 className="font-semibold text-brown-800 mb-2">6. Limitation of Liability</h3>
      <p className="mb-6 text-brown-700">To the fullest extent permitted by applicable law, the developers shall not be liable for any indirect, incidental, special, consequential, or exemplary damages arising out of or in connection with your use of the System. The developers' total liability, whether in contract, tort (including negligence), or otherwise, shall not exceed the amount paid by you (if any) for the use of the System.</p>
      <h3 className="font-semibold text-brown-800 mb-2">7. Modifications and Termination</h3>
      <p className="mb-6 text-brown-700">The developers reserve the right to modify, suspend, or terminate the System, in whole or in part, at any time without prior notice. The developers may also update these Terms from time to time, and it is your responsibility to review the Terms periodically for any changes. Your continued use of the System after the Terms have been updated constitutes your acceptance of the modified Terms.</p>
      <h3 className="font-semibold text-brown-800 mb-2">8. Governing Law and Jurisdiction</h3>
      <p className="mb-6 text-brown-700">These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of [Your Jurisdiction].</p>
      <h3 className="font-semibold text-brown-800 mb-2">9. Severability</h3>
      <p className="mb-6 text-brown-700">If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.</p>
      <h3 className="font-semibold text-brown-800 mb-2">10. Entire Agreement</h3>
      <p className="mb-6 text-brown-700">These Terms constitute the entire agreement between you and the developers regarding the use of the Smart Inventory Management system and supersede any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and the developers.</p>
      <h3 className="font-semibold text-brown-800 mb-2">11. Contact Information</h3>
      <p className="mb-6 text-brown-700">If you have any questions or concerns regarding these Terms, please contact our team at [Your Contact Information].</p>
      <p className="mb-2 text-brown-700"><b>Effective Date:</b> [Your Effective Date]</p>
    </div>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
      {/* Overlay for background blur */}
      <div className="absolute inset-0 bg-yellow-100/70 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden border-8 border-yellow-200" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
        {/* Left: Branding */}
        <div className="flex-1 flex flex-col justify-center items-start bg-transparent p-10 md:p-16 gap-6">
          {/* Logo Image */}
          <div className="w-24 h-24 mb-6 bg-yellow-300 rounded-2xl flex items-center justify-center shadow-lg border-4 border-yellow-400">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brown-800 leading-tight drop-shadow-lg">
            Smart Inventory<br />
            Management<br />
            System
          </h1>
          <p className="text-brown-700 text-2xl font-medium mt-2 drop-shadow">Doble sa Busog, Doble sa Sulit</p>
          <button
            className="mt-8 bg-orange-400 hover:bg-orange-500 text-white text-xl font-semibold rounded-full px-10 py-2 shadow-lg border border-orange-600 transition-all active:scale-95"
            onClick={() => setShowAbout(true)}
          >
            About us
          </button>

        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center bg-orange-100/90 p-10 md:p-16">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border-4 border-yellow-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Log in</h2>
            <LoginForm onSuccess={(user) => {
              const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
              };
              navigate('/pin', { state: { user: userData } });
            }} />
            <div className="flex flex-col gap-2 mt-2 text-xs text-gray-600 items-center">
              <span>Forgot your password? <a href="#" className="text-blue-800 font-semibold hover:underline">Click here</a> to reset you password</span>
              <hr className="w-full border-gray-300 my-2" />
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" className="accent-orange-500 w-4 h-4" />
                <span>By continuing, you agree with our <button type="button" className="text-blue-800 font-semibold hover:underline focus:outline-none" onClick={() => setShowTerms(true)}>Terms and Conditions</button></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Optionally, add a wooden table foreground here if image is available */}
      {showAbout && <AboutUsOverlay onClose={() => setShowAbout(false)} />}
      {showTerms && <TermsOverlay onClose={() => setShowTerms(false)} />}
    </div>
  );
};

export default Landing;