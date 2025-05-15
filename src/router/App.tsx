import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../landing/pages/Landing";
import PinEntry from "../landing/pages/PinEntry";
import StaffDashboard from "../dashboard/staff/pages/dashboard";
import StaffSales from "../dashboard/staff/pages/sales";
import StaffInventory from "../dashboard/staff/pages/inventory";
import AboutUs from "../dashboard/AboutUs";
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import AdminSignUp from "../admin/AdminSignUp";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/pin" element={<PinEntry />} />
                <Route path="/dashboard/staff" element={<StaffDashboard />} />
                <Route path="/dashboard/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/dashboard/staff/sales" element={<StaffSales />} />
                <Route path="/dashboard/staff/inventory" element={<StaffInventory />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminsignup" element={<AdminSignUp />} />
            </Routes>
        </Router>
    )
}

export default App
