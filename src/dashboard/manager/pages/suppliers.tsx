import React, { useState, useEffect } from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import { useNavigate } from 'react-router-dom';
import { FirestoreService } from '../../../services/firestoreService';

const SUPPLIER_CATEGORIES = [
  { label: 'Buns', icon: '🍔' },
  { label: 'Patty', icon: '🥩' },
  { label: 'Drinks', icon: '🥤' },
  { label: 'Others', icon: '🍹' },
];

const emptySupplier = { name: '', phone: '', email: '', address: '', category: SUPPLIER_CATEGORIES[0].label };

const SuppliersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(SUPPLIER_CATEGORIES[0].label);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [showRequest, setShowRequest] = useState<any>(null);
  const [form, setForm] = useState(emptySupplier);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const docs = await FirestoreService.getAll('suppliers');
      setSuppliers(docs);
      setLoading(false);
    };
    fetchSuppliers();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await FirestoreService.create('suppliers', form);
    setShowAdd(false);
    setForm(emptySupplier);
    const docs = await FirestoreService.getAll('suppliers');
    setSuppliers(docs);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await FirestoreService.update('suppliers', showEdit.id, form);
    setShowEdit(null);
    setForm(emptySupplier);
    const docs = await FirestoreService.getAll('suppliers');
    setSuppliers(docs);
  };

  const handleDelete = async (id: string) => {
    await FirestoreService.delete('suppliers', id);
    const docs = await FirestoreService.getAll('suppliers');
    setSuppliers(docs);
  };

  const selectedCat = SUPPLIER_CATEGORIES.find(cat => cat.label === selectedCategory);

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
          <h1 className="text-2xl font-bold text-[#B77B2B] mb-0">Suppliers</h1>
          <button
            className="ml-auto bg-[#F2B04A] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors"
            onClick={() => { setShowAdd(true); setForm(emptySupplier); }}
          >
            + Add Supplier
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          {SUPPLIER_CATEGORIES.map(cat => (
            <button
              key={cat.label}
              className={`px-6 py-2 rounded-lg font-semibold border-none focus:outline-none transition-colors duration-200 text-xl flex items-center gap-2 ${selectedCategory === cat.label ? 'bg-[#F9C97B] text-white' : 'bg-[#FFF3E0] text-[#B77B2B]'}`}
              onClick={() => setSelectedCategory(cat.label)}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-[#B77B2B]">Loading...</div>
        ) : selectedCat && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedCat.icon}</span>
              <span className="font-bold text-lg text-[#B77B2B]">{selectedCat.label}</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="grid grid-cols-12 px-4 py-2 border-b font-semibold text-[#B77B2B]">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Supplier Name</div>
                <div className="col-span-4">Address</div>
                <div className="col-span-4">Contact</div>
                <div className="col-span-3 text-center"> </div>
              </div>
              {suppliers.filter(supplier => supplier.category === selectedCat.label).length === 0 ? (
                <div className="px-4 py-3 text-[#B77B2B]">No suppliers in this category.</div>
              ) : suppliers.filter(supplier => supplier.category === selectedCat.label).map((supplier, idx) => (
                <div key={supplier.id} className="grid grid-cols-12 px-4 py-3 items-center border-b last:border-b-0 bg-[#FFD59A]">
                  <div className="col-span-1 font-bold">{idx + 1}</div>
                  <div className="col-span-3">{supplier.name}</div>
                  <div className="col-span-4">{supplier.address}</div>
                  <div className="col-span-4 flex flex-col gap-1">
                    <span><i className="fa fa-phone mr-2"></i>{supplier.phone}</span>
                    <span><i className="fa fa-envelope mr-2"></i>{supplier.email}</span>
                  </div>
                  <div className="col-span-3 flex justify-center gap-2">
                    <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full shadow" onClick={() => setShowRequest(supplier)}>REQUEST</button>
                    <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-full shadow" onClick={() => { setShowEdit(supplier); setForm(supplier); }}>EDIT</button>
                    <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-full shadow" onClick={() => handleDelete(supplier.id)}>DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Add Supplier Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500" onClick={() => setShowAdd(false)} aria-label="Close">&times;</button>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#B77B2B] mb-2">Add Supplier</h2>
              <input type="text" className="border rounded px-3 py-2" placeholder="Supplier Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input type="text" className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              <input type="email" className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <input type="text" className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
              <select className="border rounded px-3 py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {SUPPLIER_CATEGORIES.map(cat => (
                  <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
              </select>
              <button type="submit" className="bg-[#B77B2B] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors">Add</button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Supplier Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500" onClick={() => setShowEdit(null)} aria-label="Close">&times;</button>
            <form onSubmit={handleEdit} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#B77B2B] mb-2">Edit Supplier</h2>
              <input type="text" className="border rounded px-3 py-2" placeholder="Supplier Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input type="text" className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              <input type="email" className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <input type="text" className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
              <select className="border rounded px-3 py-2" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {SUPPLIER_CATEGORIES.map(cat => (
                  <option key={cat.label} value={cat.label}>{cat.label}</option>
                ))}
              </select>
              <button type="submit" className="bg-[#B77B2B] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors">Save</button>
            </form>
          </div>
        </div>
      )}
      {/* Request Modal */}
      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500" onClick={() => setShowRequest(null)} aria-label="Close">&times;</button>
            <h2 className="text-xl font-bold text-[#B77B2B] mb-2">Contact Supplier</h2>
            <div className="mb-2"><span className="font-semibold">Name:</span> {showRequest.name}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {showRequest.phone}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {showRequest.email}</div>
            <div className="mb-2"><span className="font-semibold">Address:</span> {showRequest.address}</div>
            <button className="bg-[#F2B04A] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors mt-4" onClick={() => {navigator.clipboard.writeText(`${showRequest.name} | ${showRequest.phone} | ${showRequest.email} | ${showRequest.address}`)}}>Copy Contact Info</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPage; 