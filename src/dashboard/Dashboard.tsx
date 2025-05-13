import logo from "../assets/logo 1.png";
import { useNavigate, useLocation } from "react-router-dom";

const salesData = [
  { name: "Minute Burger", value: 17 },
  { name: "Cheesy Burger", value: 15 },
  { name: "Cheesydog", value: 9 },
  { name: "Beef Shawarma Burger", value: 5 },
  { name: "Chicken Time", value: 5 },
  { name: "Double Minute Burger", value: 4 },
];

const stockData = [
  { name: "Value Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
  { name: "Cheesy Buns", status: "LOW STOCK", color: "text-yellow-500", bar: "border-yellow-400" },
  { name: "Chicken Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
  { name: "DMB Buns", status: "OUT OF STOCK", color: "text-red-600", bar: "border-red-400" },
];

import StaffDashboard from "./StaffDashboard";
import ManagerDashboard from "./ManagerDashboard";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), displayName: currentUser.displayName, email: currentUser.email });
          } else {
            setUser({ displayName: currentUser.displayName, email: currentUser.email, role: "staff" }); // fallback
          }
        } else if (location.state?.user) {
          setUser(location.state.user);
        } else {
          setUser({ displayName: "JM", role: "Manager", branch: "Branch" }); // fallback for dev
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (user?.role && user.role.toLowerCase() === "staff") {
    return <StaffDashboard user={user} />;
  }

  // Manager/Admin dashboard (now as separate component)
  return <ManagerDashboard user={user} />;
}
