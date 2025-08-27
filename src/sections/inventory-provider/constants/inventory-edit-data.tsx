import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";

export const setInventoryEditFormData = (
  product: InventoryStoreFormData
): FormData => {
  const formData = new FormData();

  (product.products || []).forEach((variant: any, vi: number) => {
    Object.entries(variant).forEach(([key, value]) => {
      if (key.toLowerCase() === "images" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append(`products[${vi}].images`, file);
        });
      } else if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof File)
      ) {
        Object.entries(value).forEach(([subKey, subVal]) => {
          formData.append(
            `products[${vi}].${key}[${subKey}]`,
            subVal == null ? "" : String(subVal)
          );
        });
      } else if (value !== undefined && value !== null) {
        formData.append(`products[${vi}].${key}`, String(value));
      }
    });
  });

  // campos de primer nivel
  formData.append("storeId", String(product.storeId));
  formData.append("supplierId", String(product.supplierId));
  formData.append("warehouseId", String(product.warehouseId));
  formData.append("parentProductId", String(product.parentProductId));

  return formData;
};
