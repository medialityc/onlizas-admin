export type VirtualWarehouseUIData = {
  id: number;
  occupancyPercentage: number; // porcentaje utilizado (0-100)
  productsCount?: number; // cantidad de productos mostrada en la card
  currentCapacity?: number; // opcional, si queremos mostrar X / Y
  maxCapacity?: number; // opcional, si queremos mostrar X / Y
};

// Mock UI para proveedor (solo almacenes virtuales)
// Basado en los IDs virtuales del mock principal (4, 5, 6)
export const VIRTUAL_WAREHOUSE_UI_MOCK: Record<number, VirtualWarehouseUIData> = {
  4: { id: 4, occupancyPercentage: 75, productsCount: 156, currentCapacity: 7500, maxCapacity: 10000 },
  5: { id: 5, occupancyPercentage: 64, productsCount: 89, currentCapacity: 3200, maxCapacity: 5000 },
  6: { id: 6, occupancyPercentage: 60, productsCount: 45, currentCapacity: 1800, maxCapacity: 3000 },
};
