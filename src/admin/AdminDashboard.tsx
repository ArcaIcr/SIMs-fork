import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { authService } from '../services/authService';

// Types for Branch and User
interface Branch {
  id: string;
  name: string;
  location: string;
  managerId: string;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  branchId?: string;
  lastLogin?: Date;
  shift?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  // Add Account Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<'MANAGER' | 'STAFF'>('MANAGER');
  const [newBranchId, setNewBranchId] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newShift, setNewShift] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Branch));
      setBranches(branchList);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch users, optionally filtered by branch
  const fetchUsers = async (branchId?: string) => {
    try {
      const usersCollection = collection(db, 'users');
      let usersQuery = branchId 
        ? query(usersCollection, where('branchId', '==', branchId))
        : usersCollection;
      
      const userSnapshot = await getDocs(usersQuery);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    // Check if user is admin
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !authService.isAdmin()) {
      navigate('/adminlogin');
      return;
    }

    fetchBranches();
    fetchUsers();
  }, []);

  // Handle branch selection
  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId);
    fetchUsers(branchId);
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/adminlogin');
  };

  const handleAddAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!newEmail || !newPassword || !newDisplayName || !newBranchId || !newPin || !newShift) {
      setAddError('All fields are required.');
      return;
    }
    try {
      const user = await authService.signUp({ email: newEmail, password: newPassword, displayName: newDisplayName });
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: newEmail,
          displayName: newDisplayName,
          role: newRole,
          branchId: newBranchId,
          pin: newPin,
          shift: newShift,
        });
        setAddSuccess('Account created successfully!');
        setTimeout(() => {
          setShowAddModal(false);
          setNewEmail(''); setNewPassword(''); setNewDisplayName(''); setNewRole('MANAGER'); setNewBranchId(''); setNewPin(''); setNewShift(''); setAddSuccess('');
          fetchUsers(selectedBranch || undefined);
        }, 1200);
      } else {
        setAddError('Sign up failed. Email may already be in use.');
      }
    } catch (err) {
      setAddError('An error occurred during sign up.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Add Account
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Branch Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              {addError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{addError}</div>}
              {addSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{addSuccess}</div>}
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Display Name</label>
                <input type="text" value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as 'MANAGER' | 'STAFF')} className="mt-1 block w-full border px-3 py-2 rounded">
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Branch</label>
                <select value={newBranchId} onChange={e => setNewBranchId(e.target.value)} required className="mt-1 block w-full border px-3 py-2 rounded">
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">PIN</label>
                <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} required maxLength={6} minLength={4} pattern="[0-9]*" inputMode="numeric" className="mt-1 block w-full border px-3 py-2 rounded" placeholder="Enter 4-6 digit PIN" />
              </div>
              <div>
                <label className="block text-sm font-medium">Shift</label>
                <select
                  value={newShift}
                  onChange={e => setNewShift(e.target.value)}
                  required
                  className="mt-1 block w-full border px-3 py-2 rounded"
                >
                  <option value="">Select shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branches Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Branches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map(branch => (
            <div 
              key={branch.id} 
              className={`p-4 rounded-lg shadow cursor-pointer ${selectedBranch === branch.id ? 'bg-blue-100' : 'bg-white'}`}
              onClick={() => handleBranchSelect(branch.id)}
            >
              <h3 className="font-bold">{branch.name}</h3>
              <p className="text-gray-600">{branch.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {selectedBranch ? 'Branch Users' : 'All Users'}
        </h2>
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Last Login</th>
              <th className="p-3 text-left">Shift</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.displayName || 'N/A'}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  {branches.find(b => b.id === user.branchId)?.name || 'Unassigned'}
                </td>
                <td className="p-3">
                  {user.lastLogin ? user.lastLogin.toLocaleString() : 'Never'}
                </td>
                <td className="p-3">{user.shift || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
