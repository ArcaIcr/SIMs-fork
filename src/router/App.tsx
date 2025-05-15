import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../landing/pages/Landing";
import PinEntry from "../landing/pages/PinEntry";
import ManagerDashboard from "../dashboard/manager/pages/dashboard";
import ManagerSales from "../dashboard/manager/pages/sales";
import InventoryPage from "../dashboard/manager/pages/inventory";
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
                <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                <Route path="/dashboard/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/dashboard/manager/sales" element={<ManagerSales />} />
                <Route path="/dashboard/manager/inventory" element={<InventoryPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminsignup" element={<AdminSignUp />} />
            </Routes>
        </Router>
    )
}

export default App
