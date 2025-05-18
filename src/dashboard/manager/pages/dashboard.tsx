import React from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CommonSalesCard from '../components/CommonSalesCard';
import StockTrackerCard from '../components/StockTrackerCard';

const Dashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <ManagerNavbar />
      <div className="flex-1 flex flex-col items-center justify-start px-8 py-6 gap-8">
        {/* Top Buttons */}
        <div className="flex gap-8 w-full max-w-2xl justify-center mt-4">
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/manager/sales')}>Sales</button>
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]">Suppliers</button>
        </div>
        {/* Main Dashboard Content */}
        <div className="flex gap-8 w-full max-w-5xl mt-6">
          <CommonSalesCard />
          <StockTrackerCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
