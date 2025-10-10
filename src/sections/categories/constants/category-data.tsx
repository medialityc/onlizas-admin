import { processImageFile } from "@/utils/image-helpers";
import { CategoryFormData } from "../schemas/category-schema";
import { toast } from "react-toastify";

export const setCategoryFormData = async (
  category: CategoryFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar features
  const features = (category.features || []).map((f: any) => ({
    name: f.featureName,
    description: f.featureDescription,
    isPrimary: !!f.isPrimary,
    isRequired: !!f.isRequired,
    suggestions: f.suggestions ?? [],
  }));

  // Procesar imagen
  if (category.image) {
    const processedImage = await processImageFile(category.image);
    if (processedImage) {
      formData.append("image", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }

  // Datos básicos de la categoría
  formData.append("departmentId", String(category.departmentId));
  formData.append("name", category.name);
  formData.append("description", category.description);
  formData.append("active", String(category.active));

  formData.append(`features`, JSON.stringify(features));

  return formData;
};
