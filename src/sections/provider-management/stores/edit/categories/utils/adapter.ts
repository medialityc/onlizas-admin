import { StoreCategory } from "@/types/store-categories";



// Adapta el shape del backend a la UI y ordena por 'order' ascendente
export function adaptStoreCategories(raw: any[]): StoreCategory[] {
  const adapted: StoreCategory[] = (raw || [])
    .map((c: any, idx: number) => ({
      categoryId: Number(c?.categoryId ?? 0),
      categoryName: c?.categoryName ?? `Cat ${idx + 1}`,
      id: Number(c?.id ?? 0),
      storeId: Number(c?.storeId ?? 0),
      //productCount: Number(c?.productCount ?? 0),
      //views: Number(c?.views ?? 0),
      isActive: Boolean(c?.isActive ?? true),
      order: Number(c?.order ?? idx + 1),
    }))
    .sort((a, b) => a.order - b.order);
   

  return adapted;
}
