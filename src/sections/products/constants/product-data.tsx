import { detailsArrayToObject } from "@/utils/format";
import { toast } from "react-toastify";
import { ProductFormData } from "../schema/product-schema";
import { processImageFile } from "@/utils/image-helpers";

export const setProductFormData = async (
  product: ProductFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  if (product.image) {
    const processedImage = await processImageFile(product.image);
    if (processedImage instanceof Blob) {
      formData.append("image", processedImage);
    } else if (typeof processedImage === "string") {
      formData.append("imageUrl", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("active", String(product.active));
  formData.append("supplierUserIds", JSON.stringify(product.supplierUserIds));
  formData.append("categoryIds", JSON.stringify(product.categoryIds));
  /* dimensions */
  formData.append("width", String(product.width));
  formData.append("height", String(product.height));
  formData.append("length", String(product.length));
  formData.append("weight", String(product.weight));
  formData.append("aduanaCategoryGuid", String(product.aduanaCategoryGuid));
  formData.append(
    "customsValueAduanaUsd",
    String(product.customsValueAduanaUsd)
  );
  formData.append("rateXValue", String(product.valuePerUnit ?? 0));
  formData.append("isDurable", String(product.isDurable));
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
