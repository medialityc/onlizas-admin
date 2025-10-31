import { StoreCategory } from "@/types/store-categories";



// Adapta el shape del backend a la UI y ordena por 'order' ascendente
export function adaptStoreCategories(raw: any[]): StoreCategory[] {
  const adapted: StoreCategory[] = (raw || [])
    .map((c: any, idx: number) => ({
      // Preserve GUIDs as strings if provided; fallback to empty string instead of 0
      categoryId: c?.categoryId ?? "",
      categoryName: c?.categoryName ?? `Cat ${idx + 1}`,
      // Backend may send property 'id' for store-category identifier; keep original value (likely GUID)
      id: c?.id ?? c?.categoryId ?? "",
      storeId: c?.storeId ?? "",
      active: Boolean(c?.active ?? true),
      // 'order' should remain numeric for sorting; parseInt safely
      order: typeof c?.order === "number" ? c.order : Number(c?.order ?? idx + 1),
    }))
    .sort((a, b) => a.order - b.order);
   

  return adapted;
}
