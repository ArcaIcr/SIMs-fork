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
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Supplier } from '../models/supplierModel';

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
      console.log(`FirestoreService.getById: Attempting to fetch document from ${collectionName}/${documentId}`);
      console.log(`Document ID type: ${typeof documentId}`);
      
      const docRef = doc(db, collectionName, documentId);
      console.log('Document reference created:', docRef);
      
      const docSnap = await getDoc(docRef);
      console.log('Document snapshot exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        console.log('Document data:', data);
        return data;
      }
      console.log('Document does not exist');
      return null;
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      console.error('Full error details:', error);
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
    console.log(`FirestoreService: Attempting to delete document in collection ${collectionName} with ID ${documentId}`);
    try {
      const docRef = doc(db, collectionName, documentId);
      console.log(`FirestoreService: Calling deleteDoc for document reference:`, docRef);
      await deleteDoc(docRef);
      console.log(`FirestoreService: deleteDoc completed successfully for ID ${documentId}`);
      return true;
    } catch (error) {
      console.error(`FirestoreService: Error deleting document ${documentId} from ${collectionName}:`, error);
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

  // Generic method to set (create or overwrite) a document by path and id
  static async setDoc(collectionPath: string, documentId: string, data: Record<string, any>): Promise<boolean> {
    try {
      const docRef = doc(db, collectionPath, documentId);
      await setDoc(docRef, data);
      return true;
    } catch (error) {
      console.error(`Error setting document in ${collectionPath}:`, error);
      return false;
    }
  }

  // Get sales history for a product across all dates
  static async getSalesHistory(productId: number): Promise<{ date: string, count: number, revenue: number }[]> {
    try {
      const { db } = await import('../firebase');
      const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');
      const salesCollection = collection(db, 'sales');
      const salesSnapshots = await getDocs(salesCollection);
      const history: { date: string, count: number, revenue: number }[] = [];
      for (const dateDoc of salesSnapshots.docs) {
        // Fetch product doc from subcollection 'products' under each date
        const productDoc = await getDoc(doc(db, `sales/${dateDoc.id}/products`, String(productId)));
        if (productDoc.exists()) {
          const data = productDoc.data();
          history.push({ date: dateDoc.id, count: data.count, revenue: data.revenue });
        }
      }
      // Sort by date descending
      return history.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
      console.error('Error fetching sales history:', error);
      return [];
    }
  }

  // Fetch all sales data for all dates
  static async getAllSalesData(): Promise<{ date: string, products: any[] }[]> {
    const salesCollection = collection(db, 'sales');
    const salesSnapshots = await getDocs(salesCollection);
    const allSales: { date: string, products: any[] }[] = [];
    for (const dateDoc of salesSnapshots.docs) {
      const productsSnapshot = await getDocs(collection(db, `sales/${dateDoc.id}/products`));
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      allSales.push({ date: dateDoc.id, products });
    }
    return allSales;
  }

  // Generic method to get all documents in a collection with real-time updates
  static onCollectionSnapshot<T>(collectionName: string, onData: (data: T[]) => void, onError: (error: Error) => void) {
    const collectionRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      onData(docs);
    }, (error) => {
      console.error(`Error listening to ${collectionName} snapshot:`, error);
      onError(error);
    });
    return unsubscribe;
  }

  // Specific snapshot listener for suppliers
  static onSuppliersSnapshot(onData: (data: Supplier[]) => void, onError: (error: Error) => void) {
    return this.onCollectionSnapshot<Supplier>('suppliers', onData, onError);
  }

  // Search suppliers by any field
  static async searchSuppliers(field: string, value: any): Promise<Supplier[]> {
    try {
      console.log(`Searching suppliers where ${field} = ${value}`);
      const suppliersCollection = collection(db, 'suppliers');
      const q = query(suppliersCollection, where(field, '==', value));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Supplier));
      console.log(`Found ${results.length} matching suppliers:`, results);
      return results;
    } catch (error) {
      console.error('Error searching suppliers:', error);
      return [];
    }
  }
}
