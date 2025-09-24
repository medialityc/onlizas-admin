import { processImageFile } from "@/utils/image-helpers";
import { toast } from "react-toastify";
import { HomeBannerFormData } from "../schema/banner-schema";

export const setHomeBannerFormData = async (
  banner: HomeBannerFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  if (banner.imageDesktopUrl) {
    if (banner.imageDesktopUrl instanceof File) {
      const processedImage = await processImageFile(banner.imageDesktopUrl);
      if (processedImage) {
        formData.append("imageDesktopUrl", processedImage);
      } else {
        toast.error("Error al procesar la imagen");
      }
    }
  }
  // Procesar imagen
  if (banner.imageMobileUrl) {
    if (banner.imageMobileUrl instanceof File) {
      const processedImage = await processImageFile(banner.imageMobileUrl);
      if (processedImage) {
        formData.append("imageMobileUrl", processedImage);
      } else {
        toast.error("Error al procesar la imagen");
      }
    }
  }

  // Datos básicos del banner
  formData.append("link", String(banner.link));
  formData.append("isActive", String(banner.isActive));

  /* banner.regionIds.forEach((id, index) =>
    formData.append(`regionIds[${index}]`, String(id))
  ); */
  formData.append(`regionIds`, JSON.stringify(banner?.regionIds));

  return formData;
};
