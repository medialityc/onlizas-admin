import { toast } from "react-toastify";
import { imageConvertWebp } from "@/utils/image-convert";
import { isValidUrl, urlToFile } from "@/utils/format";

/**
 * Procesa una imagen, convirtiéndola a WebP si es un File.
 * Si es un string y es una URL válida, la descarga y la convierte a File/WebP.
 * Si es un string no URL (ej: base64 o path interno), la devuelve tal cual.
 */
export async function processImageFile(
  image: File | string,
): Promise<File | string | null> {
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
      console.error("Error al procesar la imagen");
      toast.error("Error al procesar la imagen");
      return null;
    }
  } else if (typeof image === "string") {
    // Si es una URL válida, intentar convertirla a File para enviarla como FormFile
    if (isValidUrl(image)) {
      try {
        const fileFromUrl = await urlToFile(image);
        const processedImage = await imageConvertWebp(fileFromUrl);
        if (processedImage) {
          return processedImage;
        } else {
          toast.error("Error al convertir la imagen descargada a WebP");
          return null;
        }
      } catch (error) {
        console.error("Error al convertir URL a File", error);
        toast.error("Error al procesar la imagen desde URL");
        return null;
      }
    }

    // No es una URL, devolver el string original (compatibilidad)
    return image;
  }

  return null;
}
