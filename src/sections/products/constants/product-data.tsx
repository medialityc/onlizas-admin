import { detailsArrayToObject } from "@/utils/format";
import { toast } from "react-toastify";
import { ProductFormData } from "../schema/product-schema";

export const setProductFormData = async (
  product: ProductFormData
): Promise<FormData> => {
  const formData = new FormData();
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  // Procesar imagen
  if (product.image) {
    const image = product.image;
    if (image instanceof File) {
      if (image.size > MAX_IMAGE_SIZE) {
        toast.error(`La imagen ${image.name} excede el tamaño máximo de 5MB`);
      } else {
        formData.append("image", image);
      }
    } else if (typeof image === "string") {
      // if the UI may pass existing image URLs as strings, consider sending them as text fields
      formData.append("image", image); // optional: backend must accept this
    }
  }

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("isActive", String(product.isActive));
  formData.append("supplierUserIds", JSON.stringify(product.supplierUserIds));
  formData.append("categoryIds", JSON.stringify(product.categoryIds));
  /* dimensions */
  formData.append("width", String(product.width));
  formData.append("height", String(product.height));
  formData.append("length", String(product.length));
  formData.append("weight", String(product.weight));

  formData.append("aboutThis", JSON.stringify(product.aboutThis));
  // Details: enviar como pares details[clave]
  if (product.details) {
    formData.append(
      "details",
      JSON.stringify(detailsArrayToObject(product.details))
    );
  }

  return formData;
};
