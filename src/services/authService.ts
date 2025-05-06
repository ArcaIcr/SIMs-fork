import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { FirestoreService } from './firestoreService';

interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export const authService = {
  // Sign Up (Create Account)
  signUp: async ({ email, password, displayName }: SignUpCredentials): Promise<User | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name if provided
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
      
      return user;
    } catch (error) {
      console.error('Sign Up Error:', error);
      return null;
    }
  },

  // Sign In
  signIn: async ({ email, password }: SignInCredentials): Promise<User | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login for the user
      if (user) {
        await FirestoreService.updateUser(user.uid, { 
          lastLogin: new Date(),
          // Optional: Add role-based logic here
          role: email === 'admin@sims.com' ? 'ADMIN' : 'STAFF'
        });
      }
      
      return user;
    } catch (error) {
      console.error('Sign In Error:', error);
      return null;
    }
  },

  // Sign Out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  },

  // Password Reset
  resetPassword: async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password Reset Error:', error);
      return false;
    }
  },

  // Get Current User
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const currentUser = auth.currentUser;
    return currentUser?.email === 'admin@sims.com' || false;
  }
};
