export type StoreCategory = {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  views: number;
  isActive: boolean;
  order?: number;
};

export const mockCategories: StoreCategory[] = [
  { id: 1, name: "Laptops", description: "Computadoras portátiles de todas las marcas", productCount: 45, views: 1250, isActive: true, order: 1 },
  { id: 2, name: "Gaming", description: "Laptops para gaming", productCount: 15, views: 450, isActive: true, order: 2 },
  { id: 3, name: "Ultrabooks", description: "Laptops ultradelgadas", productCount: 20, views: 650, isActive: true, order: 3 },
  { id: 4, name: "Smartphones", description: "Teléfonos inteligentes de última generación", productCount: 32, views: 980, isActive: true, order: 4 },
];

// Future: Persist order to backend (e.g., PATCH /categories/order)
export async function persistCategoryOrder(categories: StoreCategory[]) {
  // Placeholder: map to payload [{id, order}] and call service
  // const payload = categories.map((c, idx) => ({ id: c.id, order: idx + 1 }));
  // await updateCategoriesOrder(payload)
  return Promise.resolve();
}
