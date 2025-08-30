import type { StoreCategory } from "../mock";

// Adapta el shape del backend a la UI y ordena por 'order' ascendente
export function adaptStoreCategories(raw: any[]): StoreCategory[] {
  const adapted: StoreCategory[] = (raw || [])
    .map((c: any, idx: number) => ({
      id: Number(c?.categoryId ?? idx + 1),
      name: c?.categoryName ?? `Cat ${idx + 1}`,
      productCount: Number(c?.productCount ?? 0),
      views: Number(c?.views ?? 0),
      isActive: Boolean(c?.isActive ?? true),
      order: Number(c?.order ?? idx + 1),
    }))
    .sort((a, b) => a.order - b.order);

  return adapted;
}
