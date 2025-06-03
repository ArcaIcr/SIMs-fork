import { FirestoreService } from '../services/firestoreService';
import { addNotification } from './notificationModel';

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  category: string;
}

export async function addSupplier(
  supplier: Omit<Supplier, 'id'>,
  user: { displayName?: string; branchId?: string }
): Promise<Supplier | null> {
  const supplierToAdd: Omit<Supplier, 'id'> = {
    ...supplier,
  };
  
  const docId = await FirestoreService.create('suppliers', supplierToAdd);
  
  if (docId && user.branchId && user.displayName) {
    await addNotification({
      message: `added new supplier "${supplier.name}"`,
      type: 'info',
      branchId: user.branchId,
      actorName: user.displayName,
    });
    return { id: docId, ...supplierToAdd };
  }
  
  return null;
}

export async function updateSupplier(
  id: string,
  updates: Partial<Omit<Supplier, 'id'>>,
  user: { displayName?: string; branchId?: string }
): Promise<boolean> {
  try {
    await FirestoreService.update('suppliers', id, updates);

    const supplier = await FirestoreService.getById<Supplier>('suppliers', id);

    if (supplier && user.branchId && user.displayName) {
      await addNotification({
        message: `updated supplier "${supplier.name}"`,
        type: 'info',
        branchId: user.branchId,
        actorName: user.displayName,
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating supplier:', error);
    return false;
  }
}

export async function deleteSupplier(
  id: string,
  user: { displayName?: string; branchId?: string }
): Promise<boolean> {
  try {
    // Validate input
    if (!id) {
      console.error('Invalid supplier ID provided');
      return false;
    }

    console.log(`Attempting to delete supplier with ID: ${id}`);
    console.log(`ID type: ${typeof id}`);

    // First try to get the supplier directly
    let supplier = await FirestoreService.getById<Supplier>('suppliers', id);
    
    // If not found and the ID looks like a timestamp, try to find it in all suppliers
    if (!supplier && /^\d{13}$/.test(id)) {
      console.log('ID appears to be a timestamp, searching in all suppliers...');
      const allSuppliers = await FirestoreService.getAll<Supplier>('suppliers');
      const foundSupplier = allSuppliers.find(s => s.id === id);
      
      if (!foundSupplier) {
        console.error(`Supplier with timestamp ID ${id} not found in any suppliers`);
        return false;
      }
      supplier = foundSupplier;
      console.log('Found supplier with timestamp ID:', supplier);
    }
    
    if (!supplier) {
      console.error(`Supplier with ID ${id} not found in Firestore`);
      console.error(`Collection path: suppliers/${id}`);
      return false;
    }

    // Validate supplier data structure
    if (!supplier.name || !supplier.address || !supplier.phone || !supplier.email || !supplier.category) {
      console.error(`Invalid supplier data structure for ID ${id}:`, supplier);
      return false;
    }

    console.log(`Found supplier to delete:`, supplier);
    const deletionSuccessful = await FirestoreService.delete('suppliers', supplier.id);

    if (deletionSuccessful && user.branchId && user.displayName) {
      await addNotification({
        message: `deleted supplier "${supplier.name}" (${supplier.category})`,
        type: 'warning',
        branchId: user.branchId,
        actorName: user.displayName,
      });
    }

    return deletionSuccessful;
  } catch (error) {
    console.error('Error deleting supplier:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);
    return false;
  }
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  return FirestoreService.getAll<Supplier>('suppliers');
}

export async function findSupplierByOldId(oldId: string): Promise<Supplier | null> {
  try {
    // First try to find by the old ID directly
    const suppliers = await FirestoreService.searchSuppliers('id', oldId);
    if (suppliers.length > 0) {
      return suppliers[0];
    }

    // If not found, try to find by any other field that might contain the old ID
    const allSuppliers = await fetchSuppliers();
    const supplier = allSuppliers.find(s => 
      s.id === oldId || 
      s.name?.includes(oldId) || 
      s.email?.includes(oldId)
    );
    
    if (supplier) {
      console.log('Found supplier by old ID:', supplier);
      return supplier;
    }

    console.log('No supplier found with old ID:', oldId);
    return null;
  } catch (error) {
    console.error('Error finding supplier by old ID:', error);
    return null;
  }
} 