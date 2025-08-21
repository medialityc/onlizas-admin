import { isValidUrl, urlToFile } from "@/utils/format";
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
    if (typeof category.image === "string" && isValidUrl(category.image)) {
      try {
        const imageFile = await urlToFile(category.image);
        formData.append("image", imageFile);
      } catch {
        toast.error("Error al procesar la imagen desde URL");
      }
    } else if (category.image instanceof File) {
      formData.append("image", category.image);
    }
  }

  // Datos básicos de la categoría
  formData.append("departmentId", String(category.departmentId));
  formData.append("name", category.name);
  formData.append("description", category.description);
  formData.append("isActive", String(category.isActive));

  formData.append(`features`, JSON.stringify(features));

  return formData;
};
