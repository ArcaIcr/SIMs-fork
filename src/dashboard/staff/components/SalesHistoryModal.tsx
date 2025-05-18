import React, { useEffect, useState } from 'react';
import { FirestoreService } from '../../../services/firestoreService';

interface SalesHistoryModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

// Helper to ensure date is in YYYY-MM-DD format
function toISODate(val: string) {
  if (!val) return '';
  // If already in YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  // If in DD/MM/YYYY, convert
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
    const [d, m, y] = val.split('/');
    return `${y}-${m}-${d}`;
  }
  // Try to parse and format
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  return val;
}

const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({ productId, productName, onClose }) => {
  const [history, setHistory] = useState<{ date: string, count: number, revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await FirestoreService.getSalesHistory(productId);
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [productId]);

  // Filter history by date range (always use YYYY-MM-DD)
  const filteredHistory = history.filter(row => {
    const rowDate = toISODate(row.date);
    const start = toISODate(startDate);
    const end = toISODate(endDate);
    // Debug log
    console.log('row.date:', row.date, 'rowDate:', rowDate, 'start:', start, 'end:', end);
    if (start && rowDate < start) return false;
    if (end && rowDate > end) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-[#B77B2B] mb-4">{productName} - Sales History</h2>
        <div className="flex gap-2 mb-4 items-center">
          <label className="text-[#B77B2B] text-sm">From:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={startDate}
            onChange={e => setStartDate(toISODate(e.target.value))}
            max={endDate || undefined}
          />
          <label className="text-[#B77B2B] text-sm">To:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={endDate}
            onChange={e => setEndDate(toISODate(e.target.value))}
            min={startDate || undefined}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Count</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-4 text-[#B77B2B]">No data in range</td></tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr key={row.date}>
                    <td className="py-1">{row.date}</td>
                    <td className="py-1">{row.count}</td>
                    <td className="py-1">₱ {row.revenue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesHistoryModal; 