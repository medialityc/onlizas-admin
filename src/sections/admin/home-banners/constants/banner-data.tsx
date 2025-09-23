import { processImageFile } from "@/utils/image-helpers";
import { toast } from "react-toastify";
import { HomeBannerFormData } from "../schema/banner-schema";

export const setHomeBannerFormData = async (
  banner: HomeBannerFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Procesar imagen
  if (banner.imageDesktopUrl) {
    const processedImage = await processImageFile(banner.imageDesktopUrl);
    if (processedImage) {
      formData.append("imageDesktopUrl", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }
  // Procesar imagen
  if (banner.imageMobileUrl) {
    const processedImage = await processImageFile(banner.imageMobileUrl);
    if (processedImage) {
      formData.append("imageMobileUrl", processedImage);
    } else {
      toast.error("Error al procesar la imagen");
    }
  }

  // Datos básicos del banner
  formData.append("link", String(banner.link));
  formData.append("regionId", String(banner.regionId));
  formData.append("isActive", String(banner.isActive));

  return formData;
};
