import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

export const setInventoryProviderFormData = async (
  product: InventoryProviderFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Si tienes imágenes como FileList o array de File para cada variant:
  product.storesWarehouses.forEach((sw: any, i) => {
    formData.append(`StoresWarehouses[${i}].StoreId`, sw.storeId);

    sw.warehouseIds.forEach((wid: any, widIdx: number) => {
      formData.append(`StoresWarehouses[${i}].WarehouseIds[${widIdx}]`, wid);
    });

    sw.productVariants.forEach((variant: any, vi: number) => {
      Object.entries(variant).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append(
              `StoresWarehouses[${i}].ProductVariants[${vi}].Images`,
              file
            );
          });
        } else if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof File)
        ) {
          // Para Details y Warranty (que son objetos)
          Object.entries(value).forEach(([subKey, subVal]) => {
            formData.append(
              `StoresWarehouses[${i}].ProductVariants[${vi}].${key}.${subKey}`,
              subVal
            );
          });
        } else if (value !== undefined && value !== null) {
          formData.append(
            `StoresWarehouses[${i}].ProductVariants[${vi}].${key}`,
            value as any
          );
        }
      });
    });
  });

  // Los campos de primer nivel:
  formData.append("ProductId", String(product.productId));
  formData.append("SupplierId", String(product.supplierId));

  return formData;
};
