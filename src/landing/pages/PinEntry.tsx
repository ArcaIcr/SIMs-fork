import React, { useEffect, useState } from "react";
import logo from "../../assets/logo 1.png";
import { useNavigate, useLocation } from "react-router-dom";
import { FirestoreService, User as FirestoreUser, Branch as FirestoreBranch } from '../../services/firestoreService';

const placeholder =
  "https://ui-avatars.com/api/?name=Staff&background=E0E0E0&color=888&size=128";

const PIN_LENGTH = 6;

const PinEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = location.state?.user;
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [branches, setBranches] = useState<FirestoreBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [branchList, userList] = await Promise.all([
        FirestoreService.getAll<FirestoreBranch>('branches'),
        selectedBranch
          ? FirestoreService.getUsersByBranch(selectedBranch)
          : FirestoreService.getAll<FirestoreUser>('users'),
      ]);
      setBranches(branchList);

      // Remove duplicates by email and filter out users with no email
      const seen = new Set();
      const filtered = userList
        .filter(user => user.role !== 'ADMIN' && user.email)
        .filter(user => {
          if (seen.has(user.email)) return false;
          seen.add(user.email);
          return true;
        });

      setUsers(filtered);
      setLoading(false);
    };
    fetchData();
  }, [selectedBranch]);

  // Only allow the logged-in user to be selected
  useEffect(() => {
    if (loggedInUser) {
      const match = users.find(
        u => u.email === loggedInUser.email || u.id === loggedInUser.uid || u.id === loggedInUser.id
      );
      setSelectedUser(match || null);
    }
  }, [users, loggedInUser]);

  const handleUserClick = (user: FirestoreUser) => {
    // Only allow selecting the logged-in user
    if (user.email === loggedInUser?.email || user.id === loggedInUser?.uid || user.id === loggedInUser?.id) {
      setSelectedUser(user);
      setPin("");
      setError("");
    }
  };

  const handleNumpad = (val: string) => {
    if (val === "Cancel") {
      setPin("");
      setError("");
      return;
    }
    if (val === "Enter") {
      if (selectedUser && pin.length === PIN_LENGTH) {
        // Check PIN
        if ((selectedUser as any).pin === pin) {
          navigate("/dashboard");
        } else {
          setError("Incorrect PIN. Please try again.");
          setPin("");
        }
      }
      return;
    }
    if (pin.length < PIN_LENGTH && /^[0-9]$/.test(val)) {
      setPin(pin + val);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/assets/bg.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden bg-orange-100/90">
        {/* Left: User List */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold text-center mb-6">Who's Using?</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Branch</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-400">No users found.</div>
              ) : (
                users.map((user, idx) => {
                  const isAllowed = user.email === loggedInUser?.email || user.id === loggedInUser?.uid || user.id === loggedInUser?.id;
                  const key = user.id ? `${user.id}-${idx}` : `user-${idx}`;
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-4 border-b pb-2 last:border-b-0 last:pb-0 transition ${isAllowed ? 'cursor-pointer hover:bg-orange-100' : 'opacity-50 cursor-not-allowed'} ${selectedUser?.id === user.id ? 'bg-orange-100' : ''}`}
                      onClick={() => isAllowed && handleUserClick(user)}
                    >
                      <img
                        src={placeholder}
                        alt={user.displayName || user.email}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <span className={`text-xs font-bold ${user.role === 'MANAGER' ? 'text-orange-600' : 'text-gray-500'}`}>{user.role}</span>
                        <div className="font-medium text-gray-800 leading-tight">{user.displayName || user.email}</div>
                        {user.branchId && (
                          <div className="text-xs text-gray-400">Branch: {branches.find(b => b.id === user.branchId)?.name || user.branchId}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        {/* Right: PIN Entry */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md flex flex-col items-center gap-8">
            <h2 className="text-lg font-semibold text-center">Enter your PIN to access this profile.</h2>
            <div className="flex gap-4 justify-center mb-6">
              {[...Array(PIN_LENGTH)].map((_, i) => (
                <div key={i} className={`w-10 h-12 rounded bg-gray-200 flex items-center justify-center text-2xl font-bold ${pin.length > i ? 'bg-orange-300 text-orange-900' : ''}`}>
                  {pin[i] || ''}
                </div>
              ))}
            </div>
            {selectedUser && (
              <div className="bg-orange-200 rounded-2xl shadow-lg p-4">
                <div className="bg-white rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                      <button key={n} className="text-orange-600 text-xl font-bold py-2 rounded hover:bg-orange-50 transition" onClick={() => handleNumpad(n.toString())}>{n}</button>
                    ))}
                    <button className="text-orange-400 font-semibold py-2 rounded hover:bg-orange-50 transition" onClick={() => handleNumpad('Cancel')}>Cancel</button>
                    <button className="text-orange-600 text-xl font-bold py-2 rounded hover:bg-orange-50 transition" onClick={() => handleNumpad('0')}>0</button>
                    <button className="text-orange-600 font-semibold py-2 rounded hover:bg-orange-50 transition" onClick={() => handleNumpad('Enter')}>Enter</button>
                  </div>
                  {error && <div className="text-red-600 text-center mt-2">{error}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinEntry;
