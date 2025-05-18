import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../../../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

interface CustomUser extends Omit<FirebaseUser, 'displayName' | 'photoURL'> {
  birthday?: string;
  phone?: string;
  pin?: string;
  photoURL?: string;
  role?: string;
  displayName?: string;
}

const placeholderPhoto = 'https://randomuser.me/api/portraits/men/32.jpg';

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
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const customUser = user as CustomUser;
      setBirthday(customUser.birthday || '');
      setPhone(customUser.phone || '');
      setEmail(customUser.email || '');
      setPin(customUser.pin || '');
      setPhotoURL(customUser.photoURL || '');
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // Validate PIN if it's being updated
      if (pin) {
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
          throw new Error('PIN must be exactly 6 digits');
        }
      }

      const userData: Partial<CustomUser> = {
        birthday,
        phone,
        email,
        photoURL,
      };
      if (pin) {
        userData.pin = pin;
      }

      // Query the user document by email
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, userData);
        setMessage('Profile updated successfully!');
      } else {
        setMessage('User not found.');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to update profile.');
    }
    setSaving(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    setMessage('');
    try {
      const file = e.target.files[0];
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not authenticated');
      const storageRef = ref(storage, `profileImages/${uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateDoc(doc(db, 'users', uid), { photoURL: url });
      setMessage('Profile image updated!');
    } catch (err) {
      setMessage('Failed to upload image.');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setMessage('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6] flex flex-col">
      <div className="px-8 py-6 max-w-2xl mx-auto">
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
        <div className="bg-white rounded-2xl shadow p-6 mb-6 border-b-2 border-[#E2C089]">
          <div className="font-bold text-lg text-[#B77B2B] mb-2">Profile</div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={photoURL || placeholderPhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-[#E2C089] object-cover" />
              <input
                type="file"
                accept="image/*"
                className="absolute left-0 top-0 w-20 h-20 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                disabled={uploading}
                title="Upload profile image"
              />
              {uploading && <div className="absolute left-0 top-0 w-20 h-20 flex items-center justify-center bg-white/70 rounded-full text-xs">Uploading...</div>}
            </div>
            <div>
              <div className="font-semibold text-[#B77B2B] text-xl">{user?.displayName || 'Staff'}</div>
              <div className="text-sm text-[#8B6F3A]">{user?.role || 'Staff'}</div>
            </div>
          </div>
        </div>
        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6 border-b-2 border-[#E2C089]">
          <div className="font-bold text-lg text-[#B77B2B] mb-2">Personal Information</div>
          <div className="text-sm text-[#8B6F3A] mb-4">Manage your information details, including birthday, email address, and phone number, to ensure your account is up to date.</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Birthday</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-[#FFF7E6]" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Phone Number</label>
              <input type="text" className="w-full border rounded px-3 py-2 bg-[#FFF7E6]" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 bg-[#FFF7E6]" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="font-bold text-lg text-[#B77B2B] mb-2">Account</div>
          <div className="text-sm text-[#8B6F3A] mb-4">Update your pin to secure your account.</div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#B77B2B]">6-pin Code</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-[#FFF7E6]" value={pin} onChange={e => setPin(e.target.value)} maxLength={6} />
          </div>
        </div>
        {/* Save Button and Message */}
        <div className="flex justify-end">
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-8 rounded-full shadow disabled:opacity-50"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {message && <div className="mt-4 text-center text-sm text-[#B77B2B]">{message}</div>}
      </div>
    </div>
  );
};

export default SettingsPage; 