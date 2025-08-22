import { isValidUrl, urlToFile } from "@/utils/format";
import { toast } from "react-toastify";
import { ProductFormData } from "../schema/product-schema";

export const setProductFormData = async (
  product: ProductFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  if (product.image) {
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
  formData.append("details", JSON.stringify(product.details));

  return formData;
};
