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
}

const SalesProductGrid: React.FC<SalesProductGridProps> = ({ products }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {products.map((prod) => (
      <SalesProductCard key={prod.id} product={prod} />
    ))}
  </div>
);

export default SalesProductGrid; 