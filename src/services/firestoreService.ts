import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  query,
  where,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Branch Interface
export interface Branch {
  id?: string;
  name: string;
  location: string;
  managerId?: string;
}

// User Interface
export interface User {
  id?: string;
  email: string;
  displayName?: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
  branchId?: string;
  lastLogin?: Date;
}

export class FirestoreService {
  // Branch Management Methods
  static async createBranch(branchData: Branch): Promise<string | null> {
    try {
      const branchRef = await addDoc(collection(db, 'branches'), branchData);
      return branchRef.id;
    } catch (error) {
      console.error('Error creating branch:', error);
      return null;
    }
  }

  static async updateBranch(branchId: string, branchData: Partial<Branch>): Promise<boolean> {
    try {
      const branchRef = doc(db, 'branches', branchId);
      await updateDoc(branchRef, branchData);
      return true;
    } catch (error) {
      console.error('Error updating branch:', error);
      return false;
    }
  }

  static async deleteBranch(branchId: string): Promise<boolean> {
    try {
      const branchRef = doc(db, 'branches', branchId);
      await deleteDoc(branchRef);
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      return false;
    }
  }

  static async getBranches(): Promise<Branch[]> {
    try {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      return branchSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Branch));
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }

  // User Management Methods
  static async createUser(userData: User): Promise<string | null> {
    try {
      const userRef = await addDoc(collection(db, 'users'), userData);
      return userRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, userData);
      } else {
        // If the document does not exist, create it
        await setDoc(userRef, userData);
      }
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async getUsersByBranch(branchId: string): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('branchId', '==', branchId));
      const userSnapshot = await getDocs(q);
      return userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error fetching users by branch:', error);
      return [];
    }
  }
  // Generic method to add a document to a collection
  static async create<T extends Record<string, any>>(collectionName: string, data: T): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      return null;
    }
  }

  // Generic method to get a document by ID
  static async getById<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return null;
    }
  }

  // Generic method to get all documents in a collection
  static async getAll<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      return [];
    }
  }

  // Generic method to update a document
  static async update<T>(collectionName: string, documentId: string, data: Partial<T>): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return false;
    }
  }

  // Generic method to delete a document
  static async delete(collectionName: string, documentId: string): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return false;
    }
  }

  // Method to query documents with a specific condition
  static async query<T>(collectionName: string, field: string, operator: any, value: any): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      return [];
    }
  }
}
