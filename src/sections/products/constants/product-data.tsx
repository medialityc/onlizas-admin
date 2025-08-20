import { isValidUrl, urlToFile } from "@/utils/format";
import { toast } from "react-toastify";
import { ProductFormData } from "../schema/product-schema";

export const setProductFormData = async (
  product: ProductFormData
): Promise<FormData> => {
  const formData = new FormData();

  if (product.images && product.images.length > 0) {
    for (let i = 0; i < product.images.length; i++) {
      const image = product.images[i];

      if (typeof image === "string" && isValidUrl(image)) {
        try {
          const imageFile = await urlToFile(image, `image-${i}.jpg`);
          formData.append("images", imageFile);
        } catch (error) {
          console.error(`Error al procesar imagen ${i} desde URL:`, error);
          toast.error(`Error al procesar la imagen ${i + 1} desde URL`);
        }
      } else if (image instanceof File) {
        formData.append("images", image);
      } else if (image && typeof image === "object" && image.url) {
        try {
          const imageFile = await urlToFile(image.url, `image-${i}.jpg`);
          formData.append("images", imageFile);
        } catch (error) {
          console.error(`Error al procesar imagen ${i} desde objeto:`, error);
          toast.error(`Error al procesar la imagen ${i + 1}`);
        }
      }
    }
  }

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("isActive", String(product.isActive));
  formData.append("supplierIds", JSON.stringify(product.supplierIds));
  formData.append("categoryIds", JSON.stringify(product.categoryIds));
  formData.append("dimensions", JSON.stringify(product.dimensions));
  formData.append("about", JSON.stringify(product.about));
  formData.append("details", JSON.stringify(product.details));
  formData.append("features", JSON.stringify(product.features));

  return formData;
};
