import React from 'react';

interface SalesCategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const SalesCategoryTabs: React.FC<SalesCategoryTabsProps> = ({ categories, selected, onSelect }) => (
  <div className="flex gap-2 mb-6">
    {categories.map((cat) => (
      <button
        key={cat}
        className={`px-6 py-2 rounded-lg font-semibold border-none focus:outline-none transition-colors duration-200 ${
          selected === cat ? 'bg-[#F9C97B] text-white' : 'bg-[#FFF3E0] text-[#B77B2B]'
        }`}
        onClick={() => onSelect(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default SalesCategoryTabs;
