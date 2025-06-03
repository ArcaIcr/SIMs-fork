import React, { useState, useEffect } from 'react';
import StaffNavbar from '../components/StaffNavbar';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Supplier, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } from '../../../models/supplierModel';
import { FirestoreService } from '../../../services/firestoreService';
import { fetchNotifications } from '../../../models/notificationModel';

const SUPPLIER_CATEGORIES = [
  { label: 'Food', icon: '🍔' },
  { label: 'Drinks', icon: '🥤' },
  { label: 'Others', icon: '🍹' },
];

const emptySupplier = {
  name: '',
  address: '',
  phone: '',
  email: '',
  category: SUPPLIER_CATEGORIES[0].label,
};

const SuppliersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(SUPPLIER_CATEGORIES[0].label);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState<Supplier | null>(null);
  const [showRequest, setShowRequest] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptySupplier);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => { 
    const handleSnapshotError = (error: Error) => {
      console.error("Firestore snapshot error:", error);
      setError(`Failed to fetch suppliers: ${error.message}`);
    };
    const unsubscribe = FirestoreService.onSuppliersSnapshot(setSuppliers, handleSnapshotError);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (showEdit) {
        const success = await updateSupplier(showEdit.id, form, {
          displayName: user?.displayName,
          branchId: user?.branchId,
        });
        if (success) {
          const docs = await fetchSuppliers();
          setSuppliers(docs);
          setShowEdit(null);
          setSuccess('Supplier updated successfully!');
        } else {
          setError('Failed to update supplier. Please try again.');
        }
      } else {
        const added = await addSupplier(form, {
          displayName: user?.displayName,
          branchId: user?.branchId,
        });
        if (added) {
          setSuppliers(prev => [...prev, added]);
          setShowAdd(false);
          setSuccess('Supplier added successfully!');
        } else {
          setError('Failed to add supplier. Please try again.');
        }
      }
      setForm(emptySupplier);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Validate user context
      if (!user?.branchId || !user?.displayName || !user?.email) {
        setError('User context is incomplete. Please try logging in again.');
        return;
      }

      // Check if supplier still exists in our local state
      const supplierToDelete = suppliers.find(s => s.id === id);
      if (!supplierToDelete) {
        setError('Supplier no longer exists or has been deleted.');
        return;
      }

      const success = await deleteSupplier(id, {
        displayName: user.displayName,
        branchId: user.branchId,
      });
      
      if (success) {
        setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
        setSuccess(`Successfully deleted supplier "${supplierToDelete.name}"`);
        
        // Refresh notifications after successful deletion
        await fetchNotifications(user.email, user.branchId, false);
      } else {
        setError('Failed to delete supplier. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError('An error occurred while deleting the supplier. Please try again.');
    }
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
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        {success && (
          <div className="text-green-500 mb-4">{success}</div>
        )}
        {suppliers.filter(s => s.category === selectedCategory).map((supplier, idx) => {
          const category = SUPPLIER_CATEGORIES.find(cat => cat.label === supplier.category);
          return (
            <div key={supplier.id} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{category?.icon}</span>
                <span className="font-bold text-lg text-[#B77B2B]">{supplier.name}</span>
              </div>
              <div className="bg-white rounded-2xl shadow-xl">
                <div className="grid grid-cols-12 px-4 py-2 border-b font-semibold text-[#B77B2B]">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Supplier Name</div>
                  <div className="col-span-4">Address</div>
                  <div className="col-span-4">Contact</div>
                  <div className="col-span-3 text-center"> </div>
                </div>
                <div className="grid grid-cols-12 px-4 py-3 items-center border-b last:border-b-0 bg-[#FFD59A]">
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
              </div>
            </div>
          );
        })}
      </div>
      {/* Add Supplier Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500" onClick={() => setShowAdd(false)} aria-label="Close">&times;</button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-[#B77B2B] text-2xl font-bold hover:text-red-500" onClick={() => setShowEdit(null)} aria-label="Close">&times;</button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
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