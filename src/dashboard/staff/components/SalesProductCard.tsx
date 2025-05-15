import React, { useState } from 'react';

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
}

const SalesProductCard: React.FC<SalesProductCardProps> = ({ product }) => {
  const [count, setCount] = useState(product.count);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={product.img} alt={product.name} className="w-24 h-24 object-cover mb-2 rounded" />
      <div className="font-semibold text-[#B77B2B] text-lg mb-1">{product.name}</div>
      <div className="text-xs text-[#8B6F3A] mb-2">Total Revenue: ₱ {product.revenue}</div>
      <div className="flex items-center gap-2 mt-2">
        <button
          className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
          onClick={() => setCount((c) => Math.max(0, c - 1))}
        >
          -
        </button>
        <span className="font-bold text-[#B77B2B] w-6 text-center">{count}</span>
        <button
          className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold"
          onClick={() => setCount((c) => c + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SalesProductCard; 