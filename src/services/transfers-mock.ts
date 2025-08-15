import { Transfer, TransferStatus } from '@/types/warehouses';
import { ApiResponse } from '@/types/fetch/api';

// Datos mock de transferencias
const mockTransfers: Transfer[] = [
  {
    id: 101,
    transferNumber: 'TR-2024-000101',
    sourceWarehouseId: 1,
    destinationWarehouseId: 2,
    status: 'in_transit',
    requestedBy: 'jdoe',
    items: [
      { productId: 1, batchIds: [1], quantity: 10 },
      { productId: 2, batchIds: [2], quantity: 2 },
    ],
    justification: 'Reposición de stock',
    createdAt: '2024-11-28T10:22:00Z',
    updatedAt: '2024-11-29T15:45:00Z',
    documents: [],
  },
  {
    id: 102,
    transferNumber: 'TR-2024-000102',
    sourceWarehouseId: 3,
    destinationWarehouseId: 1,
    status: 'pending',
    requestedBy: 'mruiz',
    items: [
      { productId: 3, batchIds: [3], quantity: 5 },
    ],
    justification: 'Transferencia programada',
    createdAt: '2024-11-30T09:10:00Z',
    updatedAt: '2024-11-30T09:15:00Z',
    documents: [],
  },
  {
    id: 103,
    transferNumber: 'TR-2024-000103',
    sourceWarehouseId: 1,
    destinationWarehouseId: 4,
    status: 'delivered',
    requestedBy: 'lgarcia',
    items: [
      { productId: 4, batchIds: [4], quantity: 20 },
    ],
    justification: 'Entrega a sucursal',
    createdAt: '2024-11-15T12:00:00Z',
    updatedAt: '2024-11-20T12:00:00Z',
    documents: [],
  },
];

export async function getTransfersByWarehouseId (warehouseId: number, status?: TransferStatus): Promise<ApiResponse<Transfer[]>> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  let filtered = mockTransfers.filter(
    (t) => t.sourceWarehouseId === warehouseId || t.destinationWarehouseId === warehouseId
  );
  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }
  return { data: filtered, status: 200, error: false };
}
