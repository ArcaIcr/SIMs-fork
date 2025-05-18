import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, Notification } from '../../../models/notificationModel';
// You can use react-icons or SVGs for better icons
// import { FaBell, FaCog } from 'react-icons/fa';

interface StaffNavbarProps {
  user?: {
    displayName?: string;
    role?: string;
    shift?: string;
    branchName?: string;
    id?: string;
  } | null;
}

const StaffNavbar: React.FC<StaffNavbarProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      const notifs = await fetchNotifications(user?.id);
      setNotifications(notifs);
      setLoading(false);
    };
    fetchNotifs();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    await markAllNotificationsRead(user?.id);
    const notifs = await fetchNotifications(user?.id);
    setNotifications(notifs);
  };

  const handleCloseNotifications = () => setShowNotifications(false);

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-[#FFF7E6] border-b-2 border-[#E2C089] shadow-md">
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Minute Burger" className="w-14 h-14 rounded-full bg-white border" />
        <div>
          <div className="font-bold text-lg text-[#B77B2B]">Hello, {user?.displayName || 'Staff'}!</div>
          <div className="text-xs text-[#8B6F3A]">SIMS {user?.role || 'Staff'} | Shift: {user?.shift || 'N/A'}</div>
          <div className="text-xs text-[#8B6F3A]">{user?.branchName ? `Branch: ${user.branchName}` : 'Branch'}</div>
        </div>
      </div>
      <div className="flex gap-4">
        {/* Notification Button */}
        <button
          className="bg-white rounded-full shadow p-3 flex items-center justify-center text-2xl hover:bg-orange-100 transition relative"
          onClick={handleOpenNotifications}
          aria-label="Notifications"
        >
          {/* Bell SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8B6F3A" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a2.25 2.25 0 01-4.714 0m9.214-2.615c-.519-.612-1.35-1.511-1.35-5.217 0-3.866-2.239-6-5.25-6s-5.25 2.134-5.25 6c0 3.706-.83 4.605-1.35 5.217A1.35 1.35 0 005.25 16.5h13.5a1.35 1.35 0 001.071-2.033z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
          )}
        </button>
        {/* Settings Button */}
        <button
          className="bg-white rounded-full shadow p-3 flex items-center justify-center text-2xl hover:bg-orange-100 transition"
          onClick={() => navigate('/dashboard/staff/settings')}
          aria-label="Settings"
        >
          {/* Cog SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8B6F3A" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {/* Notification Pop-up */}
        {showNotifications && (
          <div className="absolute top-16 right-0 bg-white border border-[#E2C089] rounded-xl shadow-lg p-4 w-80 z-50">
            <div className="font-bold text-[#B77B2B] mb-2">Notifications</div>
            {loading ? (
              <div className="text-sm text-[#8B6F3A]">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="text-sm text-[#8B6F3A]">No notifications.</div>
            ) : (
              <ul className="max-h-60 overflow-y-auto divide-y divide-[#FFE6A7]">
                {notifications.map(n => (
                  <li key={n.id} className={`py-2 px-1 ${n.read ? 'bg-white' : 'bg-[#FFF7E6]'}`}>
                    <div className={`font-semibold ${n.type === 'warning' ? 'text-yellow-600' : n.type === 'error' ? 'text-red-600' : n.type === 'success' ? 'text-green-600' : 'text-[#B77B2B]'}`}>{n.message}</div>
                    <div className="text-xs text-[#8B6F3A] mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
            <button className="mt-4 text-xs text-orange-500 hover:underline" onClick={handleCloseNotifications}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffNavbar; 