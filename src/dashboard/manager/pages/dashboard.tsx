import React, { useEffect, useState } from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import { useNavigate } from 'react-router-dom';
import StockTrackerCard from '../components/StockTrackerCard';
import { FirestoreService } from '../../../services/firestoreService';
import { DUMMY_PRODUCTS } from '../../staff/pages/sales';

const Dashboard = () => {
  const navigate = useNavigate();
  const [commonSales, setCommonSales] = useState<{ id: string, name: string, count: number, revenue: number, img?: string }[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchAndAggregate() {
      const allSales = await FirestoreService.getAllSalesData();
      const salesMap: Record<string, { count: number, revenue: number }> = {};
      allSales.forEach(({ products }) => {
        products.forEach(prod => {
          if (!salesMap[prod.id]) {
            salesMap[prod.id] = { count: 0, revenue: 0 };
          }
          salesMap[prod.id].count += prod.count || 0;
          salesMap[prod.id].revenue += prod.revenue || 0;
        });
      });
      // Map to DUMMY_PRODUCTS for name and img
      const salesArr = DUMMY_PRODUCTS
        .map(prod => ({
          id: String(prod.id),
          name: prod.name,
          img: prod.img,
          count: salesMap[prod.id]?.count || 0,
          revenue: salesMap[prod.id]?.revenue || 0,
        }))
        .filter(prod => prod.count > 0)
        .sort((a, b) => b.count - a.count);
      setCommonSales(salesArr);
    }
    fetchAndAggregate();
  }, []);

  // Calculate summary
  const totalSold = commonSales.reduce((sum, prod) => sum + prod.count, 0);
  const totalRevenue = commonSales.reduce((sum, prod) => sum + prod.revenue, 0);
  const topN = 5;
  const displaySales = showAll ? commonSales : commonSales.slice(0, topN);

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <ManagerNavbar />
      <div className="flex-1 flex flex-col items-center justify-start px-8 py-6 gap-8">
        {/* Top Buttons */}
        <div className="flex gap-8 w-full max-w-2xl justify-center mt-4">
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/manager/sales')}>Sales</button>
          <button className="flex-1 py-4 rounded-2xl bg-white shadow text-xl font-semibold text-[#B77B2B] border-2 border-[#E2C089] hover:bg-[#FFF0D2]" onClick={() => navigate('/dashboard/manager/suppliers')}>Suppliers</button>
        </div>
        {/* Main Dashboard Content */}
        <div className="flex gap-8 w-full max-w-5xl mt-6">
          {/* Common Sales */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
            <div className="text-lg font-bold text-[#B77B2B] mb-2 flex items-center gap-4">
              All-Time Common Sales
            </div>
            <div className="mb-2 text-sm text-[#8B6F3A] flex gap-8">
              <span>Total Sold: <span className="font-bold text-[#B77B2B]">{totalSold}</span></span>
              <span>Total Revenue: <span className="font-bold text-[#B77B2B]">₱{totalRevenue.toLocaleString()}</span></span>
            </div>
            <div className="flex flex-col gap-2">
              {displaySales.length === 0 ? (
                <div className="text-[#B77B2B]">No sales data.</div>
              ) : (
                displaySales.map((prod) => (
                  <React.Fragment key={prod.id}>
                    <div
                      className="flex justify-between items-center font-semibold text-[#B77B2B] group"
                      title={`${prod.name} | Sold: ${prod.count} | Revenue: ₱${prod.revenue.toLocaleString()}`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={prod.img}
                          alt={prod.name}
                          className="w-8 h-8 object-cover rounded border border-[#E2C089] bg-white"
                          title={prod.name}
                        />
                        <span title={prod.name}>{prod.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span>{prod.count} <span className="text-xs text-[#8B6F3A]">sold</span></span>
                        <span className="text-xs text-green-700">₱{prod.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div
                      className="w-full h-2 bg-[#FFE6A7] rounded mb-2"
                      title={`${prod.name} - ${prod.count} sold`}
                    >
                      <div
                        className="h-2 bg-[#F2B04A] rounded"
                        style={{ width: `${Math.min(100, (prod.count / (displaySales[0]?.count || 1)) * 100)}%` }}
                        title={`${prod.name} - ${prod.count} sold`}
                      ></div>
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
            {commonSales.length > topN && (
              <button
                className="mt-2 text-xs text-orange-600 hover:underline"
                onClick={() => setShowAll(v => !v)}
              >
                {showAll ? 'Show Top 5' : `Show All (${commonSales.length})`}
              </button>
            )}
          </div>
          {/* Stock Tracker */}
          <StockTrackerCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
