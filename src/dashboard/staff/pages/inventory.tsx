import React, { useState, useEffect } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FirestoreService } from '../../../services/firestoreService';
import { InventoryItem, fetchInventory, addInventoryItem, adjustInventoryStock } from '../../../models/inventoryModel';

const CATEGORIES = [
  { label: 'Buns', icon: '🍔' },
  { label: 'Patty', icon: '🥩' },
  { label: 'Drinks', icon: '🥤' },
  { label: 'Others', icon: '🍹' },
];

const statusColor = {
  low: 'bg-red-500',
  medium: 'bg-yellow-400',
  high: 'bg-green-500',
};

const InventoryPage = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].label);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [localStocks, setLocalStocks] = useState<{ [id: number]: number }>({});
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    stock: 0,
    category: CATEGORIES[0].label,
  });
  const [adding, setAdding] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState<number | null>(null);
  const [bulkAmount, setBulkAmount] = useState('');
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{id: number, amount: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredItems = items.filter(item => item.category === selectedCategory);

  useEffect(() => {
    (async () => {
      const fetched = await fetchInventory();
      setItems(fetched);
      setLocalStocks({}); // Reset local stocks on fetch
    })();
  }, []);

  const handleStockChange = (id: number, delta: number) => {
    const currentStock = items.find(i => i.id === id)?.stock ?? 0;
    const newStock = Math.max(0, currentStock + delta);
    
    // Show confirmation for large changes
    if (Math.abs(delta) >= 10) {
      setShowConfirmDialog({ id, amount: delta });
      return;
    }
    
    setLocalStocks(prev => ({
      ...prev,
      [id]: newStock
    }));
  };

  const handleBulkEdit = (id: number) => {
    const currentStock = items.find(i => i.id === id)?.stock ?? 0;
    setBulkAmount(currentStock.toString());
    setShowBulkEdit(id);
  };

  const handleBulkSave = async (id: number) => {
    const newStock = parseInt(bulkAmount);
    if (isNaN(newStock) || newStock < 0) {
      setError('Please enter a valid stock number');
      return;
    }
    
    const currentStock = items.find(i => i.id === id)?.stock ?? 0;
    const adjustment = newStock - currentStock;
    
    setSavingItemId(id);
    setError(null);
    try {
      const updatedStock = await adjustInventoryStock(id, adjustment, {
        displayName: user?.displayName,
        branchId: user?.branchId,
      });
      if (updatedStock !== null) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, stock: updatedStock } : item
        ));
        setSuccess('Stock updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update stock. Please try again.');
      }
    } catch (err) {
      setError('Error updating stock. Please try again.');
    } finally {
      setSavingItemId(null);
      setShowBulkEdit(null);
    }
  };

  const handleSaveStock = async (id: number) => {
    setSavingItemId(id);
    setError(null);
    try {
      const currentStock = items.find(i => i.id === id)?.stock ?? 0;
      const newStock = localStocks[id];
      const adjustment = newStock - currentStock;
      
      const updatedStock = await adjustInventoryStock(id, adjustment, {
        displayName: user?.displayName,
        branchId: user?.branchId,
      });
      if (updatedStock !== null) {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, stock: updatedStock } : item
        ));
        setLocalStocks(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setSuccess('Stock updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update stock. Please try again.');
      }
    } catch (err) {
      setError('Error updating stock. Please try again.');
    } finally {
      setSavingItemId(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const added = await addInventoryItem(newItem, {
      displayName: user?.displayName,
      branchId: user?.branchId,
    });
    if (added) setItems(prev => [...prev, added]);
    setNewItem({ name: '', stock: 0, category: CATEGORIES[0].label });
    setShowAddForm(false);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <StaffNavbar user={user} />
      <div className="px-8 py-6">
        <div className="flex items-center mb-4">
          <button
            className="mr-4 p-2 rounded-full bg-[#FFF3E0] hover:bg-[#F9C97B] text-[#B77B2B] text-2xl shadow"
            onClick={() => navigate('/dashboard/staff')}
            aria-label="Back"
          >
            &#8592;
          </button>
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">Inventory</h1>
        </div>
        <div className="flex gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              className={`px-6 py-2 rounded-lg font-semibold border-none focus:outline-none transition-colors duration-200 text-xl flex items-center gap-2 ${selectedCategory === cat.label ? 'bg-[#F9C97B] text-white' : 'bg-[#FFF3E0] text-[#B77B2B]'}`}
              onClick={() => setSelectedCategory(cat.label)}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="bg-[#F9C97B] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            + Add Item
          </button>
        </div>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500"
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <form onSubmit={handleAddItem} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[#B77B2B] mb-2">Add New Item</h2>
                <div>
                  <label className="block text-[#B77B2B] font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#B77B2B] font-semibold mb-1">Stock</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={newItem.stock}
                    min={0}
                    onChange={e => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#B77B2B] font-semibold mb-1">Category</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.label} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-[#B77B2B] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors"
                  disabled={adding}
                >
                  {adding ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-6 h-6 rounded-full bg-red-500 inline-block"></span>
            <span className="w-6 h-6 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-6 h-6 rounded-full bg-green-500 inline-block"></span>
            <span className="ml-4 font-semibold text-[#B77B2B]">Items</span>
            <span className="ml-auto font-semibold text-[#B77B2B]">Stocks</span>
          </div>
          {filteredItems.map(item => {
            const localStock = localStocks[item.id];
            const displayStock = localStock !== undefined ? localStock : item.stock;
            const isDirty = localStock !== undefined && localStock !== item.stock;
            const isSaving = savingItemId === item.id;
            
            return (
              <div key={item.id} className="flex items-center justify-between bg-[#FFD59A] rounded-xl px-4 py-2 mb-2">
                <div className="flex items-center gap-4">
                  <span className={`w-10 h-6 rounded-full ${statusColor[item.status as 'low' | 'medium' | 'high']} inline-block`}></span>
                  <span className="font-semibold text-[#B77B2B]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {showBulkEdit === item.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 rounded border"
                        value={bulkAmount}
                        onChange={(e) => setBulkAmount(e.target.value)}
                        min="0"
                      />
                      <button 
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleBulkSave(item.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={() => setShowBulkEdit(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold" 
                        onClick={() => handleStockChange(item.id, -1)}
                      >-</button>
                      <span 
                        className="font-bold text-[#B77B2B] w-10 text-center cursor-pointer hover:underline"
                        onClick={() => handleBulkEdit(item.id)}
                      >
                        {displayStock} left
                      </span>
                      <button 
                        className="bg-[#F9C97B] text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold" 
                        onClick={() => handleStockChange(item.id, 1)}
                      >+</button>
                      {isDirty && (
                        <button 
                          className="ml-2 text-[#B77B2B] hover:text-green-600 text-xl" 
                          title="Save" 
                          onClick={() => handleSaveStock(item.id)}
                          disabled={isSaving}
                        >
                          {isSaving ? '💾...' : '💾'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#B77B2B] mb-4">Confirm Stock Change</h3>
            <p className="mb-4">
              Are you sure you want to {showConfirmDialog.amount > 0 ? 'add' : 'remove'} {Math.abs(showConfirmDialog.amount)} items?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmDialog(null)}
              >
                Cancel
              </button>
              <button
                className="bg-[#B77B2B] text-white px-4 py-2 rounded"
                onClick={() => {
                  setLocalStocks(prev => ({
                    ...prev,
                    [showConfirmDialog.id]: (items.find(i => i.id === showConfirmDialog.id)?.stock ?? 0) + showConfirmDialog.amount
                  }));
                  setShowConfirmDialog(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage; 