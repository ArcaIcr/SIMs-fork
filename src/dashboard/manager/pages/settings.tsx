import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../../../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { addNotification } from '../../../models/notificationModel';

const UserIcon = () => (
  <svg className="w-6 h-6 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5 text-white inline-block ml-2 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const ErrorIcon = () => (
  <svg className="w-5 h-5 text-white inline-block ml-2 animate-shake" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

const placeholderPhoto = 'https://randomuser.me/api/portraits/men/32.jpg';

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed z-50 top-6 right-6 flex items-center px-5 py-3 rounded-lg shadow-lg transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    role="alert">
    {type === 'success' ? <CheckIcon /> : <ErrorIcon />}
    <span className="ml-2 text-white font-semibold">{message}</span>
    <button className="ml-4 text-white text-lg font-bold" onClick={onClose}>&times;</button>
  </div>
);

const SettingsPage = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [branchName, setBranchName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setPin(user.pin || '');
      setPhotoURL(user.photoURL || '');
      setBranchName(user.branchName || '');
    }
  }, [user]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (phone && !validatePhone(phone)) {
        showToast('Please enter a valid phone number', 'error');
        setSaving(false);
        return;
      }
      if (email && !validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        setSaving(false);
        return;
      }
      if (pin) {
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
          showToast('PIN must be exactly 6 digits', 'error');
          setSaving(false);
          return;
        }
        if (pin !== confirmPin) {
          showToast('PINs do not match', 'error');
          setSaving(false);
          return;
        }
      }
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');
      const userData: any = {
        phone,
        email,
        photoURL,
      };
      if (pin) {
        userData.pin = pin;
      }
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, userData);
      showToast('Profile updated successfully!', 'success');
      await addNotification({
        message: 'Your profile settings have been updated successfully',
        type: 'success',
        userId: currentUser.uid
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile.', 'error');
    }
    setSaving(false);
    setShowPinConfirm(false);
    setConfirmPin('');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        setUploading(false);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        setUploading(false);
        return;
      }
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not authenticated');
      const storageRef = ref(storage, `profileImages/${uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, 'users', uid), { photoURL: url });
      showToast('Profile image updated!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to upload image.', 'error');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      showToast('Failed to logout. Please try again.', 'error');
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      if (value.length === 6) {
        setShowPinConfirm(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E6] to-[#FFE0B2] flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="p-2 rounded-full bg-[#FFF3E0] hover:bg-[#F9C97B] text-[#B77B2B] text-2xl shadow"
            onClick={() => navigate('/dashboard/manager')}
            aria-label="Back"
          >
            &#8592;
          </button>
          <button
            className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {/* Profile Section */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-8 mb-8 border-b-4 border-[#E2C089] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="relative group">
            <img src={photoURL || placeholderPhoto} alt="Profile" className="w-28 h-28 rounded-full border-4 border-[#E2C089] object-cover shadow-lg transition-transform group-hover:scale-105" />
            <input
              type="file"
              accept="image/*"
              className="absolute left-0 top-0 w-28 h-28 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              disabled={uploading}
              title="Upload profile image"
            />
            {uploading && <div className="absolute left-0 top-0 w-28 h-28 flex items-center justify-center bg-white/80 rounded-full text-xs font-bold text-orange-500">Uploading...</div>}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <UserIcon />
              <span className="font-bold text-2xl text-[#B77B2B]">{user?.displayName || 'Manager'}</span>
              {branchName && (
                <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold border border-orange-300">{branchName}</span>
              )}
            </div>
            <div className="text-sm text-[#8B6F3A] font-medium">Manager</div>
            <div className="text-xs text-[#B77B2B] mt-1">{email}</div>
          </div>
        </div>
        {/* Personal Information Section */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-8 mb-8 border-b-4 border-[#E2C089]">
          <h2 className="text-xl font-bold text-[#B77B2B] mb-4">Personal Information</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[#B77B2B] font-semibold mb-1">Phone</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="block text-[#B77B2B] font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </div>
          </div>
        </div>
        {/* PIN Section */}
        <div className="bg-white/90 rounded-3xl shadow-xl p-8 mb-8 border-b-4 border-[#E2C089]">
          <h2 className="text-xl font-bold text-[#B77B2B] mb-4">Change PIN</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[#B77B2B] font-semibold mb-1">New PIN</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={pin}
                onChange={handlePinChange}
                placeholder="Enter 6-digit PIN"
                maxLength={6}
              />
            </div>
            {showPinConfirm && (
              <div>
                <label className="block text-[#B77B2B] font-semibold mb-1">Confirm PIN</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={confirmPin}
                  onChange={e => setConfirmPin(e.target.value)}
                  placeholder="Re-enter 6-digit PIN"
                  maxLength={6}
                />
              </div>
            )}
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="bg-[#B77B2B] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#FFD59A] transition-colors"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 