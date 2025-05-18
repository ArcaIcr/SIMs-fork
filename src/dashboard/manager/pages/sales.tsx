import React, { useEffect, useState } from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FirestoreService } from '../../../services/firestoreService';
import { DUMMY_PRODUCTS } from '../../staff/pages/sales';

const SalesPage = () => {
  const { user } = useUser();
  const [allSales, setAllSales] = useState<{ id: string, name: string, count: number, revenue: number, img?: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAndAggregate() {
      const allSalesData = await FirestoreService.getAllSalesData();
      const salesMap: Record<string, { count: number, revenue: number }> = {};
      allSalesData.forEach(({ products }) => {
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
      setAllSales(salesArr);
    }
    fetchAndAggregate();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <ManagerNavbar />
      <div className="px-8 py-6">
        <div className="flex items-center mb-4">
          <button
            className="mr-4 p-2 rounded-full bg-[#FFF3E0] hover:bg-[#F9C97B] text-[#B77B2B] text-2xl shadow"
            onClick={() => navigate('/dashboard/manager')}
            aria-label="Back"
          >
            &#8592;
          </button>
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">All Sales (View Only)</h1>
        </div>
        <div className="flex flex-col gap-2">
          {allSales.length === 0 ? (
            <div className="text-[#B77B2B]">No sales data.</div>
          ) : (
            allSales.map((prod, idx) => (
              <React.Fragment key={prod.id}>
                <div className="flex justify-between items-center font-semibold text-[#B77B2B]">
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
                    style={{ width: `${Math.min(100, (prod.count / (allSales[0]?.count || 1)) * 100)}%` }}
                    title={`${prod.name} - ${prod.count} sold`}
                  ></div>
                </div>
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
