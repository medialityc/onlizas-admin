import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";

export const setInventoryEditFormData = (
  product: InventoryStoreFormData
): FormData => {
  const formData = new FormData();

  product.storesWarehouses.forEach((sw: any, i: number) => {
    formData.append(`storesWarehouses[${i}].storeId`, String(sw.storeId));

    (sw.warehouseIds || []).forEach((wid: any, widIdx: number) => {
      formData.append(
        `storesWarehouses[${i}].warehouseIds[${widIdx}]`,
        String(wid)
      );
    });

    (sw.productVariants || []).forEach((variant: any, vi: number) => {
      Object.entries(variant).forEach(([key, value]) => {
        if (key.toLowerCase() === "images" && Array.isArray(value)) {
          // archivos: repetir la misma key por cada File
          value.forEach((file: File) => {
            formData.append(
              `storesWarehouses[${i}].productVariants[${vi}].images`,
              file
            );
          });
        } else if (
          value !== null &&
          typeof value === "object" &&
          !(value instanceof File)
        ) {
          // objeto anidado: distinguir entre propiedades normales y "diccionario-like"
          // Para Details/Warranty queremos Details[clave]
          Object.entries(value).forEach(([subKey, subVal]) => {
            formData.append(
              `storesWarehouses[${i}].productVariants[${vi}].${key}[${subKey}]`,
              subVal == null ? "" : String(subVal)
            );
          });
        } else if (value !== undefined && value !== null) {
          // primitivos: Price, Quantity, IsPrime, etc.
          formData.append(
            `storesWarehouses[${i}].productVariants[${vi}].${key}`,
            String(value)
          );
        }
      });
    });
  });

  // campos de primer nivel
  formData.append("productId", String(product.productId));
  formData.append("supplierId", String(product.supplierId));

  return formData;
};
