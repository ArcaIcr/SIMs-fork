import { FirestoreService } from '../services/firestoreService';

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

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status'> & { status?: 'low' | 'medium' | 'high' }): Promise<InventoryItem | null> {
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
  return docId ? itemToAdd : null;
}

export async function updateInventoryStock(id: number, newStock: number) {
  // Find the document in Firestore by id field (not doc id, so you need to query)
  const items = await FirestoreService.query<any>('inventory', 'id', '==', id);
  if (items.length > 0) {
    const docId = items[0].id; // Firestore doc id (random string)
    let status: 'low' | 'medium' | 'high';
    if (newStock === 0) status = 'low';
    else if (newStock <= 30) status = 'low';
    else if (newStock >= 100) status = 'high';
    else status = 'medium';
    await FirestoreService.update('inventory', docId, { stock: newStock, status });
  }
}

export async function adjustInventoryStock(id: number, adjustment: number) {
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
    return newStock;
  }
  return null;
} 