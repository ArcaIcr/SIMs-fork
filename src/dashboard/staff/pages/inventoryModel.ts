import { FirestoreService } from '../../../services/firestoreService';

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