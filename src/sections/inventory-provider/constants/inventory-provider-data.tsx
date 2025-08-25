import { InventoryProviderFormData } from "../schemas/inventory-provider.schema";

export const setInventoryProviderFormData = async (
  product: InventoryProviderFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  /*   if (product.image) {
    if (typeof product.image === "string" && isValidUrl(product.image)) {
      try {
        const imageFile = await urlToFile(product.image);
        formData.append("image", imageFile);
      } catch {
        toast.error("Error al procesar la imagen desde URL");
      }
    } else if (product.image instanceof File) {
      formData.append("image", product.image);
    }
  } */

  formData.append("productId", String(product.productId));
  formData.append("supplierId", String(product.supplierId));
  formData.append(
    "storesWarehouses",
    JSON.stringify(product?.storesWarehouses)
  );

  return formData;
};
