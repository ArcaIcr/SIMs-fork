import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { addNotification } from '../../../models/notificationModel';

// Icons (using Heroicons CDN or similar, or you can swap for your icon system)
const UserIcon = () => (
  <svg className="w-6 h-6 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const InfoIcon = () => (
  <svg className="w-6 h-6 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
);
const LockIcon = () => (
  <svg className="w-6 h-6 text-orange-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2V7a2 2 0 10-4 0v2c0 1.104.896 2 2 2zm6 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6a2 2 0 012-2h8a2 2 0 012 2z" /></svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5 text-white inline-block ml-2 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const ErrorIcon = () => (
  <svg className="w-5 h-5 text-white inline-block ml-2 animate-shake" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

interface CustomUser extends Omit<FirebaseUser, 'displayName' | 'photoURL'> {
  birthday?: string;
  phone?: string;
  pin?: string;
  photoURL?: string;
  role?: string;
  displayName?: string;
  branchId?: string;
  branchName?: string;
}

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
  const [birthday, setBirthday] = useState('');
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
    const fetchUserData = async () => {
      if (user) {
        const customUser = user as CustomUser;
        setBirthday(customUser.birthday || '');
        setPhone(customUser.phone || '');
        setEmail(customUser.email || '');
        setPin(customUser.pin || '');
        setPhotoURL(customUser.photoURL || '');
        setBranchName(customUser.branchName || '');
      }
    };
    fetchUserData();
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
      if (birthday) {
        const date = new Date(birthday);
        if (isNaN(date.getTime())) {
          showToast('Please enter a valid date', 'error');
          setSaving(false);
          return;
        }
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
      const userData: Partial<CustomUser> = {
        birthday,
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
      if (user?.branchId && user?.displayName) {
        await addNotification({
          message: 'updated their profile information',
          type: 'info',
          branchId: user.branchId,
          actorName: user.displayName,
          isProfileUpdate: true,
          actorId: user.email
        });
      }
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7E6] to-[#FFE0B2] flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-4">
          <button
            className="p-2 rounded-full bg-[#FFF3E0] hover:bg-[#F9C97B] text-[#B77B2B] text-2xl shadow"
            onClick={() => navigate('/dashboard/staff')}
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
              <span className="font-bold text-2xl text-[#B77B2B]">{user?.displayName || 'Staff'}</span>
              {branchName && (
                <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold border border-orange-300">{branchName}</span>
              )}
            </div>
            <div className="text-sm text-[#8B6F3A] font-medium">{user?.role || 'Staff'}</div>
            <div className="text-xs text-[#B77B2B] mt-1">{email}</div>
          </div>
        </div>
        {/* Personal Information Section */}
        <div className="bg-white/90 rounded-2xl shadow p-6 mb-8 border-b-2 border-[#E2C089]">
          <div className="flex items-center mb-2">
            <InfoIcon />
            <span className="font-bold text-lg text-[#B77B2B]">Personal Information</span>
          </div>
          <div className="text-sm text-[#8B6F3A] mb-4">Manage your information details, including birthday, email address, and phone number, to ensure your account is up to date.</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Birthday</label>
              <input 
                type="date" 
                className="w-full border rounded-lg px-3 py-2 bg-[#FFF7E6] focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all shadow-sm" 
                value={birthday} 
                onChange={e => setBirthday(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Phone Number</label>
              <input 
                type="tel" 
                className="w-full border rounded-lg px-3 py-2 bg-[#FFF7E6] focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all shadow-sm" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                placeholder="+63 XXX XXX XXXX"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Email</label>
            <input 
              type="email" 
              className="w-full border rounded-lg px-3 py-2 bg-[#FFF7E6] focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all shadow-sm" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>
        </div>
        {/* Account Section */}
        <div className="bg-white/90 rounded-2xl shadow p-6 mb-8">
          <div className="flex items-center mb-2">
            <LockIcon />
            <span className="font-bold text-lg text-[#B77B2B]">Account</span>
          </div>
          <div className="text-sm text-[#8B6F3A] mb-4">Update your pin to secure your account.</div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">6-pin Code</label>
            <input 
              type="password" 
              className="w-full border rounded-lg px-3 py-2 bg-[#FFF7E6] focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all shadow-sm" 
              value={pin} 
              onChange={handlePinChange}
              maxLength={6}
              placeholder="Enter 6-digit PIN"
            />
          </div>
          {showPinConfirm && (
            <div className="mt-4">
              <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Confirm 6-pin Code</label>
              <input 
                type="password" 
                className="w-full border rounded-lg px-3 py-2 bg-[#FFF7E6] focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all shadow-sm" 
                value={confirmPin} 
                onChange={e => setConfirmPin(e.target.value)}
                maxLength={6}
                placeholder="Confirm 6-digit PIN"
              />
            </div>
          )}
        </div>
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className={`bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-8 rounded-full shadow transition-all flex items-center gap-2 disabled:opacity-50 ${saving ? 'cursor-wait' : ''}`}
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {saving ? 'Saving...' : 'Save'}
            {toast?.type === 'success' && toast.message.includes('Profile updated') && <CheckIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 