import React, { useState, useEffect } from 'react';
import placeholderImg from '../../../assets/placeholder.png';
import SalesHistoryModal from './SalesHistoryModal';

interface Product {
  id: number;
  name: string;
  revenue: number;
  price: number;
  count: number;
  category: string;
  img: string;
}

interface SalesProductCardProps {
  product: Product;
  onUpdateSales: (productId: number, price: number, newCount: number) => void;
}

const SalesProductCard: React.FC<SalesProductCardProps> = ({ product, onUpdateSales }) => {
  const [count, setCount] = useState(product.count);
  const [showHistory, setShowHistory] = useState(false);

  // Sync local count with parent prop
  useEffect(() => {
    setCount(product.count);
  }, [product.count]);

  const handleChange = (newCount: number) => {
    setCount(newCount);
    onUpdateSales(product.id, product.price, newCount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img
        src={product.img || placeholderImg}
        alt={product.name}
        className="w-24 h-24 object-cover mb-2 rounded"
        loading="lazy"
        onError={e => (e.currentTarget.src = placeholderImg)}
      />
      <div className="font-semibold text-[#B77B2B] text-lg mb-1">{product.name}</div>
      <div className="text-xs text-[#8B6F3A] mb-2">Total Revenue: ₱ {product.revenue}</div>
      <div className="flex items-center gap-2 mt-2">
        <button
          className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
          onClick={() => handleChange(Math.max(0, count - 1))}
        >
          -
        </button>
        <span className="font-bold text-[#B77B2B] w-6 text-center">{count}</span>
        <button
          className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
          onClick={() => handleChange(count + 1)}
        >
          +
        </button>
        <button
          className="ml-2 bg-[#FFD59A] text-[#B77B2B] px-2 py-1 rounded text-xs"
          onClick={() => setShowHistory(true)}
        >
          History
        </button>
      </div>
      {showHistory && (
        <SalesHistoryModal
          productId={product.id}
          productName={product.name}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default SalesProductCard; 