import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export type User = {
  displayName?: string;
  role?: string;
  branchId?: string;
  branchName?: string;
  email?: string;
};

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const displayName = userData.displayName ?? currentUser.displayName ?? undefined;
          let branchName: string | undefined = undefined;
          if (userData.branchId) {
            try {
              console.log('[UserContext] branchId:', userData.branchId);
              const branchDoc = await getDoc(doc(db, 'branches', userData.branchId));
              console.log('[UserContext] branchDoc.exists:', branchDoc.exists());
              if (branchDoc.exists()) {
                branchName = branchDoc.data().name;
                console.log('[UserContext] branchName:', branchName);
              } else {
                console.warn('[UserContext] Branch document not found for branchId:', userData.branchId);
              }
            } catch (err) {
              console.error('[UserContext] Error fetching branch:', err);
            }
          } else {
            console.warn('[UserContext] No branchId found in user data');
          }
          if (userData.branchId && !branchName) {
            console.warn('[UserContext] branchName could not be set for branchId:', userData.branchId);
          }
          setUser({
            ...userData,
            displayName,
            branchName,
            email: currentUser.email ?? undefined,
          } as User);
        } else {
          setUser({
            displayName: currentUser.displayName ?? undefined,
            email: currentUser.email ?? undefined,
            role: "staff"
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
