import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../landing/pages/Landing";
import PinEntry from "../landing/pages/PinEntry";
import Dashboard from "../dashboard/Dashboard";
import Settings from "../dashboard/Settings";
import Notifications from "../dashboard/Notifications";
import Sales from "../dashboard/Sales";
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminsignup" element={<AdminSignUp />} />
            </Routes>
        </Router>
    )
}

export default App
