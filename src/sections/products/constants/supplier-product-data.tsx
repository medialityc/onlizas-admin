import { detailsArrayToObject } from "@/utils/format";
import { toast } from "react-toastify";
import { SupplierProductFormData } from "../schema/supplier-product-schema";
import { processImageFile } from "@/utils/image-helpers";

export const setSupplierProductFormData = async (
  product: SupplierProductFormData
): Promise<FormData> => {
  const formData = new FormData();
  // Procesar imagen principal
  if (product?.image) {
    const processedImage = await processImageFile(product.image);
    if (processedImage) {
      formData.append("image", processedImage);
    } else {
      toast.error(`Error al procesar la imagen desde URL (${product.image})`);
    }
  }

  if (product.additionalImages) {
    const additionalImages = product.additionalImages;
    if (Array.isArray(additionalImages)) {
      await Promise.all(
        additionalImages.map(async (image, index) => {
          if (image) {
            const processedImage = await processImageFile(image);
            if (processedImage) {
              formData.append(`additionalImages[${index}]`, processedImage);
            } else {
              toast.error(`Error al procesar la imagen desde URL (${image})`);
            }
          }
        })
      );
    }
  }

  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("active", String(product.active));
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
