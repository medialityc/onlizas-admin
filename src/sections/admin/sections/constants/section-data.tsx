import { processImageFile } from "@/utils/image-helpers";
import { toast } from "react-toastify";
import { SectionFormData } from "../schema/section-schema";

export const setSectionFormData = async (
  section: SectionFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  if (section.mobileImage) {
    const processedImage = await processImageFile(section.mobileImage);
    if (processedImage) {
      formData.append("mobileImage", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }
  // Procesar imagen
  if (section.desktopImage) {
    const processedImage = await processImageFile(section.desktopImage);
    if (processedImage) {
      formData.append("desktopImage", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }

  formData.append(
    "sections",
    JSON.stringify([
      {
        title: section.title,
        urlDestinity: section.urlDestinity,
        isActive: section.isActive,
        storeId: section.storeId,
        position: section.position,
        initDate: section.initDate,
        endDate: section.endDate,
      },
    ])
  );

  // Datos básicos de la categoría
  /*   formData.append("title", String(section.title));
  formData.append("position", String(section.position));
  formData.append("storeId", String(section.storeId));
  formData.append("initDate", section.initDate.toISOString());
  formData.append("endDate", section.endDate.toISOString());
  formData.append("urlDestinity", String(section.urlDestinity));
  formData.append("isActive", String(section.isActive)); */

  return formData;
};
