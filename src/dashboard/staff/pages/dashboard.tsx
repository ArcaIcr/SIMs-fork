import React, { useEffect, useState } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { InventoryItem, fetchInventory } from '../../../models/inventoryModel';

const Dashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invLoading, setInvLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setInvLoading(true);
      const items = await fetchInventory();
      setInventory(items);
      setInvLoading(false);
    })();
  }, []);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'OUT OF STOCK', color: 'text-red-600' };
    if (stock <= 30) return { label: 'LOW STOCK', color: 'text-yellow-500' };
    if (stock >= 100) return { label: 'FULL STOCK', color: 'text-green-600' };
    return { label: 'MEDIUM STOCK', color: 'text-[#B77B2B]' };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <StaffNavbar user={user} />
      <div className="flex-1 flex flex-col items-center justify-start px-8 py-6 gap-8">
        {/* Top Buttons */}
        <div className="flex gap-8 w-full max-w-4xl justify-center mt-4">
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/staff/inventory')}>Inventory</button>
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/staff/sales')}>Sales</button>
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/staff/suppliers')}>Suppliers</button>
        </div>
        {/* Main Dashboard Content */}
        <div className="flex gap-8 w-full max-w-5xl mt-6">
          {/* Common Sales */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
            <div className="text-lg font-bold text-[#B77B2B] mb-4">Common Sales</div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center font-semibold text-[#B77B2B]">Minute Burger <span>17</span></div>
              <div className="w-full h-2 bg-[#FFE6A7] rounded mb-2"><div className="h-2 bg-[#F2B04A] rounded" style={{ width: '85%' }}></div></div>
              <div className="flex justify-between items-center font-semibold text-[#B77B2B]">Cheesy Burger <span>15</span></div>
              <div className="w-full h-2 bg-[#FFE6A7] rounded mb-2"><div className="h-2 bg-[#F2B04A] rounded" style={{ width: '75%' }}></div></div>
              <div className="flex justify-between items-center font-semibold text-[#B77B2B]">Cheesydog <span>9</span></div>
              <div className="w-full h-2 bg-[#FFE6A7] rounded mb-2"><div className="h-2 bg-[#F2B04A] rounded" style={{ width: '45%' }}></div></div>
              <div className="flex justify-between items-center font-semibold text-[#B77B2B]">Beef Shawarma Burger <span>5</span></div>
              <div className="w-full h-2 bg-[#FFE6A7] rounded mb-2"><div className="h-2 bg-[#F2B04A] rounded" style={{ width: '25%' }}></div></div>
            </div>
          </div>
          {/* Stock Tracker */}
          <div className="flex-1 bg-[#FFF7E6] rounded-2xl border-4 border-[#F2B04A] shadow-xl p-6">
            <div className="text-lg font-bold text-[#B77B2B] mb-4">Stock Tracker</div>
            <div className="flex flex-col gap-3">
              {invLoading ? (
                <div className="text-[#B77B2B]">Loading...</div>
              ) : inventory.length === 0 ? (
                <div className="text-[#B77B2B]">No inventory data.</div>
              ) : (
                inventory.map(item => {
                  const status = getStockStatus(item.stock);
                  return (
                    <div key={item.id} className="flex justify-between items-center font-bold text-[#B77B2B]">
                      <span>{item.name}</span>
                      <span className={status.color + ' font-semibold'}>{status.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 