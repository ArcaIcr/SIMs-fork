import React, { useState } from 'react';
import { FirestoreService } from '../../services/firestoreService';
import { authService } from '../../services/authService';

interface LoginFormProps {
  onSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let email = username;
      // If username is not an email, try to map displayName to email
      if (!username.includes('@')) {
        const users = await FirestoreService.getAll('users');
        const user = users.find((u: any) => (u as import('../../services/firestoreService').User).displayName === username) as import('../../services/firestoreService').User | undefined;
        if (user && user.email) {
          email = user.email;
        } else {
          setError('User not found');
          setLoading(false);
          return;
        }
      }
      // Debug: log credentials
      console.log('Trying to log in with:', email, password);
      // Use Firebase Auth for authentication
      const user = await authService.signIn({ email, password });
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err: any) {
      // Show user-friendly error for common Firebase Auth errors
      let msg = 'Login failed. Please try again.';
      if (err && err.code) {
        if (err.code === 'auth/user-not-found') msg = 'No user found with this email.';
        else if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
        else if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
        else msg = err.message || msg;
      }
      setError(msg);
      console.error('Firebase Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </span>
        <input type="text" placeholder="Username or Email" value={username} onChange={e => setUsername(e.target.value)} className="pl-12 pr-4 py-3 w-full bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg" />
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </span>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="pl-12 pr-4 py-3 w-full bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg" />
      </div>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg py-3 text-xl shadow-md transition-all active:scale-95"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

export default LoginForm; 