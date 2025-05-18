import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../landing/pages/Landing";
import PinEntry from "../landing/pages/PinEntry";
import StaffDashboard from "../dashboard/staff/pages/dashboard";
import StaffSales from "../dashboard/staff/pages/sales";
import StaffInventory from "../dashboard/staff/pages/inventory";
import StaffSuppliers from "../dashboard/staff/pages/suppliers";
import StaffSettings from "../dashboard/staff/pages/settings";
import AboutUs from "../dashboard/AboutUs";
import AdminDashboard from "../admin/AdminDashboard";
import AdminLogin from "../admin/AdminLogin";
import AdminSignUp from "../admin/AdminSignUp";
import ManagerDashboard from "../dashboard/manager/pages/dashboard";
import ManagerSales from "../dashboard/manager/pages/sales";
import ManagerSuppliers from "../dashboard/manager/pages/suppliers";
import ManagerSettings from "../dashboard/manager/pages/settings";

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
                <Route path="/dashboard/staff/suppliers" element={<StaffSuppliers />} />
                <Route path="/dashboard/staff/settings" element={<StaffSettings />} />
                <Route path="/dashboard/manager" element={<ManagerDashboard />} />
                <Route path="/dashboard/manager/sales" element={<ManagerSales />} />
                <Route path="/dashboard/manager/suppliers" element={<ManagerSuppliers />} />
                <Route path="/dashboard/manager/settings" element={<ManagerSettings />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminsignup" element={<AdminSignUp />} />
            </Routes>
        </Router>
    )
}

export default App
