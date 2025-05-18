import React from 'react';
import SalesProductCard from './SalesProductCard';

interface Product {
  id: number;
  name: string;
  revenue: number;
  price: number;
  count: number;
  category: string;
  img: string;
}

interface SalesProductGridProps {
  products: Product[];
  onUpdateSales: (productId: number, price: number, newCount: number) => void;
}

const SalesProductGrid: React.FC<SalesProductGridProps> = ({ products, onUpdateSales }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {products.map((prod) => (
      <SalesProductCard key={prod.id} product={prod} onUpdateSales={onUpdateSales} />
    ))}
  </div>
);

export default SalesProductGrid; 