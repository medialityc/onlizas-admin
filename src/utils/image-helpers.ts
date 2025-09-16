import { toast } from "react-toastify";
import { imageConvertWebp } from "@/utils/image-convert";

/**
 * Procesa una imagen, convirtiéndola a WebP si es un archivo, o devolviendo la URL si es un string.
 * @param image Imagen a procesar (puede ser un File o un string).
 * @returns Un File procesado o el string original.
 */
export async function processImageFile(image: File | string): Promise<File | string | null> {
  if (image instanceof File) {
    try {
      const processedImage = await imageConvertWebp(image);
      if (processedImage) {
        return processedImage;
      } else {
        toast.error("Error al convertir la imagen a WebP");
        return null;
      }
    } catch {
      toast.error("Error al procesar la imagen");
      return null;
    }
  } else if (typeof image === "string") {
    return image;
  }

  return null;
}