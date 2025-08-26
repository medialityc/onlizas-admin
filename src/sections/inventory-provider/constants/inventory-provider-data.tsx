import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

export const setInventoryProviderFormData = async (
  product: InventoryProviderFormData
): Promise<FormData> => {
  const formData = new FormData();

  formData.append("productId", String(product.productId));
  formData.append("supplierId", String(product.supplierId));
  formData.append("storesWarehouses", String(product.storesWarehouses));

  return formData;
};
