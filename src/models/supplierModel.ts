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
  const supplierToAdd: Supplier = {
    ...supplier,
    id: Date.now().toString(),
  };
  
  const docId = await FirestoreService.create('suppliers', supplierToAdd);
  
  if (docId && user.branchId && user.displayName) {
    await addNotification({
      message: `added new supplier "${supplier.name}"`,
      type: 'info',
      branchId: user.branchId,
      actorName: user.displayName,
    });
  }
  
  return docId ? supplierToAdd : null;
}

export async function updateSupplier(
  id: string,
  updates: Partial<Omit<Supplier, 'id'>>,
  user: { displayName?: string; branchId?: string }
): Promise<boolean> {
  const suppliers = await FirestoreService.query<Supplier>('suppliers', 'id', '==', id);
  if (suppliers.length === 0) return false;
  
  const supplier = suppliers[0];
  await FirestoreService.update('suppliers', supplier.id, updates);
  
  if (user.branchId && user.displayName) {
    await addNotification({
      message: `updated supplier "${supplier.name}"`,
      type: 'info',
      branchId: user.branchId,
      actorName: user.displayName,
    });
  }
  
  return true;
}

export async function deleteSupplier(
  id: string,
  user: { displayName?: string; branchId?: string }
): Promise<boolean> {
  const suppliers = await FirestoreService.query<Supplier>('suppliers', 'id', '==', id);
  if (suppliers.length === 0) return false;
  
  const supplier = suppliers[0];
  await FirestoreService.delete('suppliers', supplier.id);
  
  if (user.branchId && user.displayName) {
    await addNotification({
      message: `deleted supplier "${supplier.name}"`,
      type: 'warning',
      branchId: user.branchId,
      actorName: user.displayName,
    });
  }
  
  return true;
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  return FirestoreService.getAll<Supplier>('suppliers');
} 