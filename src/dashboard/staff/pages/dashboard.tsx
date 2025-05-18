import React, { useEffect, useState } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { InventoryItem, fetchInventory } from '../../../models/inventoryModel';
import { FirestoreService } from '../../../services/firestoreService';
import { DUMMY_PRODUCTS } from './sales';

function getLast7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const Dashboard = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invLoading, setInvLoading] = useState(true);
  const [commonSales, setCommonSales] = useState<{ id: number, name: string, count: number, img?: string }[]>([]);
  const [salesRange, setSalesRange] = useState<'today' | 'week'>('week');

  useEffect(() => {
    (async () => {
      setInvLoading(true);
      const items = await fetchInventory();
      setInventory(items);
      setInvLoading(false);
    })();
  }, []);

  useEffect(() => {
    // Fetch sales for the selected range and aggregate
    const fetchCommonSales = async () => {
      let days: string[] = [];
      if (salesRange === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        days = [today];
      } else {
        days = getLast7Days();
      }
      const salesMap: { [id: number]: number } = {};
      for (const day of days) {
        const salesDocs = await FirestoreService.getAll(`sales/${day}/products`);
        salesDocs.forEach((doc: any) => {
          const id = Number(doc.id);
          salesMap[id] = (salesMap[id] || 0) + (doc.count || 0);
        });
      }
      // Map to product names
      const salesArr = Object.entries(salesMap).map(([id, count]) => {
        const prod = DUMMY_PRODUCTS.find(p => p.id === Number(id));
        return prod ? { id: prod.id, name: prod.name, count: count as number, img: prod.img } : null;
      }).filter(Boolean) as { id: number, name: string, count: number, img?: string }[];
      // Sort by count desc, take top 4
      salesArr.sort((a, b) => b.count - a.count);
      setCommonSales(salesArr.slice(0, 4));
    };
    fetchCommonSales();
  }, [salesRange]);

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
            <div className="text-lg font-bold text-[#B77B2B] mb-4 flex items-center gap-4">
              Common Sales
              <div className="flex gap-2 ml-auto">
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border ${salesRange === 'today' ? 'bg-[#F2B04A] text-white' : 'bg-white text-[#B77B2B] border-[#F2B04A]'}`}
                  onClick={() => setSalesRange('today')}
                >
                  Today
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border ${salesRange === 'week' ? 'bg-[#F2B04A] text-white' : 'bg-white text-[#B77B2B] border-[#F2B04A]'}`}
                  onClick={() => setSalesRange('week')}
                >
                  Last 7 Days
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {commonSales.length === 0 ? (
                <div className="text-[#B77B2B]">No sales data.</div>
              ) : (
                commonSales.map((prod) => (
                  <React.Fragment key={prod.id}>
                    <div className="flex justify-between items-center font-semibold text-[#B77B2B]">
                      <div className="flex items-center gap-2">
                        {prod.img && (
                          <img
                            src={prod.img}
                            alt={prod.name}
                            className="w-8 h-8 object-cover rounded"
                            title={`${prod.name} - ${prod.count} sold`}
                          />
                        )}
                        <span title={prod.name}>{prod.name}</span>
                      </div>
                      <span>{prod.count}</span>
                    </div>
                    <div
                      className="w-full h-2 bg-[#FFE6A7] rounded mb-2"
                      title={`${prod.name} - ${prod.count} sold`}
                    >
                      <div
                        className="h-2 bg-[#F2B04A] rounded"
                        style={{ width: `${Math.min(100, (prod.count / (commonSales[0]?.count || 1)) * 100)}%` }}
                        title={`${prod.name} - ${prod.count} sold`}
                      ></div>
                    </div>
                  </React.Fragment>
                ))
              )}
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