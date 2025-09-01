import { detailsArrayToObject } from "@/utils/format";
import { toast } from "react-toastify";
import { SupplierProductFormData } from "../schema/supplier-product-schema";

export const setSupplierProductFormData = async (
  product: SupplierProductFormData
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
        formData.append("mainImage", image);
      }
    } else if (typeof image === "string") {
      formData.append("mainImage", image);
    }
  }

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("isActive", String(product.isActive));
  formData.append("categoryIds", JSON.stringify(product.categoryIds));
  /* dimensions */
  formData.append("width", String(product.width));
  formData.append("height", String(product.height));
  formData.append("length", String(product.length));
  formData.append("weight", String(product.weight));

  formData.append("aboutThis", JSON.stringify(product.aboutThis));

  if (product.details) {
    formData.append(
      "details",
      JSON.stringify(detailsArrayToObject(product.details as any[]))
    );
  }

  return formData;
};
