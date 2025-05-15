import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface DashboardNavProps {
  dashboardType: "manager" | "staff";
}

const navItems = {
  manager: [
    { label: "Inventory", path: "/manager/inventory" },
    { label: "Sales", path: "/manager/sales" },
    { label: "Suppliers", path: "/manager/suppliers" },
    { label: "Dashboard", path: "/dashboard" },
  ],
  staff: [
    { label: "Inventory", path: "#" },
    { label: "Sales", path: "#" },
    { label: "Suppliers", path: "#" },
  ],
};

export const DashboardNav: React.FC<DashboardNavProps> = ({ dashboardType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
      {navItems[dashboardType].map((item) => (
        <button
          key={item.label}
          className={`flex-1 px-8 py-6 bg-white rounded-2xl shadow-md text-2xl font-semibold border border-gray-200 hover:bg-orange-50 transition ${location.pathname === item.path ? "bg-orange-100 border-orange-400" : ""}`}
          onClick={() => item.path !== "#" && navigate(item.path)}
          disabled={item.path === "#"}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
