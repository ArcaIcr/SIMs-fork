import { FirestoreService } from '../services/firestoreService';
import { addNotification } from './notificationModel';

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  category: string;
  status: 'low' | 'medium' | 'high';
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const items = await FirestoreService.getAll<InventoryItem>('inventory');
  // Ensure status is typed correctly
  return items.map(item => ({
    ...item,
    status: (item.status as 'low' | 'medium' | 'high') || 'low',
  }));
}

export async function addInventoryItem(
  item: Omit<InventoryItem, 'id' | 'status'> & { status?: 'low' | 'medium' | 'high' },
  user: { displayName?: string; branchId?: string }
): Promise<InventoryItem | null> {
  let status: 'low' | 'medium' | 'high';
  if (item.stock < 15) status = 'low';
  else if (item.stock < 30) status = 'medium';
  else status = 'high';
  
  const itemToAdd: InventoryItem = {
    ...item,
    id: Date.now(),
    status,
  };
  
  const docId = await FirestoreService.create('inventory', itemToAdd);
  
  if (docId && user.branchId && user.displayName) {
    await addNotification({
      message: `added new item "${item.name}" with ${item.stock} units`,
      type: 'info',
      branchId: user.branchId,
      actorName: user.displayName,
    });
  }
  
  return docId ? itemToAdd : null;
}

export async function updateInventoryStock(
  id: number, 
  newStock: number,
  user: { displayName?: string; branchId?: string }
) {
  // Find the document in Firestore by id field (not doc id, so you need to query)
  const items = await FirestoreService.query<any>('inventory', 'id', '==', id);
  if (items.length > 0) {
    const docId = items[0].id; // Firestore doc id (random string)
    const oldStock = items[0].stock;
    let status: 'low' | 'medium' | 'high';
    if (newStock === 0) status = 'low';
    else if (newStock <= 30) status = 'low';
    else if (newStock >= 100) status = 'high';
    else status = 'medium';
    
    await FirestoreService.update('inventory', docId, { stock: newStock, status });
    
    if (user.branchId && user.displayName) {
      await addNotification({
        message: `updated stock of "${items[0].name}" from ${oldStock} to ${newStock} units`,
        type: 'info',
        branchId: user.branchId,
        actorName: user.displayName,
      });
    }
  }
}

export async function adjustInventoryStock(
  id: number, 
  adjustment: number,
  user: { displayName?: string; branchId?: string }
) {
  // Find the document in Firestore by id field
  const items = await FirestoreService.query<any>('inventory', 'id', '==', id);
  if (items.length > 0) {
    const docId = items[0].docId; // Firestore doc id (string)
    const currentStock = items[0].stock;
    const newStock = Math.max(0, currentStock + adjustment); // Ensure stock doesn't go below 0
    
    let status: 'low' | 'medium' | 'high';
    if (newStock === 0) status = 'low';
    else if (newStock <= 30) status = 'low';
    else if (newStock >= 100) status = 'high';
    else status = 'medium';
    
    await FirestoreService.update('inventory', docId, { stock: newStock, status });
    
    if (user.branchId && user.displayName) {
      const action = adjustment > 0 ? 'added' : 'removed';
      await addNotification({
        message: `${action} ${Math.abs(adjustment)} units of "${items[0].name}" (now ${newStock} units)`,
        type: 'info',
        branchId: user.branchId,
        actorName: user.displayName,
      });
    }
    
    return newStock;
  }
  return null;
} 