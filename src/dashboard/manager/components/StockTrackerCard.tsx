import React, { useEffect, useState } from 'react';
import { InventoryItem, fetchInventory } from '../../../models/inventoryModel';

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'OUT OF STOCK', color: 'text-red-600' };
  if (stock <= 30) return { label: 'LOW STOCK', color: 'text-yellow-500' };
  if (stock >= 100) return { label: 'FULL STOCK', color: 'text-green-600' };
  return { label: 'MEDIUM STOCK', color: 'text-[#B77B2B]' };
};

const StockTrackerCard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await fetchInventory();
      setInventory(items);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold text-[#B77B2B] mb-4">Stock Tracker</h2>
      <div className="flex flex-col gap-3">
        {loading ? (
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
  );
};

export default StockTrackerCard; 