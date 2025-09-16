"use server";

import sharp from "sharp";

export async function convertImageAction(file: File): Promise<File | null> {
  try {
    if (!file) {
      throw new Error("No se ha seleccionado ningún archivo");
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Formato no soportado. Use: JPEG, PNG o WebP");
    }

    // Validar tamaño máximo del archivo original (10MB)
    const maxOriginalSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxOriginalSize) {
      throw new Error("El archivo es demasiado grande. Máximo 10MB");
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `product_${timestamp}_${randomString}.webp`;

    // Detectar si la imagen original tiene canal alfa (transparencia)
    const metadata = await sharp(buffer).metadata();
    const hasAlpha = metadata.channels === 4 || metadata.hasAlpha;

    // Procesar imagen con Sharp
    let processedBuffer: Buffer;
    let attempts = 0;
    const maxAttempts = 5;
    const targetMaxSize = 300 * 1024; // 300KB
    const targetMinSize = 150 * 1024; // 150KB

    // Comenzar con calidad alta e ir reduciendo si es necesario
    let quality = 90;

    do {
      attempts++;

      const sharpInstance = sharp(buffer).resize(1200, 1200, {
        fit: "inside", // Mantiene proporción, no recorta
        withoutEnlargement: false, // Permite agrandar imágenes pequeñas
        // Solo aplicar fondo si la imagen NO tiene transparencia
        ...(hasAlpha
          ? {}
          : { background: { r: 255, g: 255, b: 255, alpha: 1 } }),
      });

      processedBuffer = await sharpInstance
        .webp({
          quality: quality,
          effort: 6, // Mayor esfuerzo de compresión (0-6)
          smartSubsample: true,
          // Preservar el canal alfa para mantener transparencia
          lossless: false, // Mantener compresión con pérdida pero preservar alfa
          nearLossless: false,
          alphaQuality: quality, // Usar la misma calidad para el canal alfa
        })
        .toBuffer();

      // Si el archivo es muy grande, reducir calidad
      if (processedBuffer.length > targetMaxSize && attempts < maxAttempts) {
        quality -= 15;
        continue;
      }

      // Si es muy pequeño y podemos mejorar calidad
      if (
        processedBuffer.length < targetMinSize &&
        quality < 95 &&
        attempts < maxAttempts
      ) {
        quality += 5;
        continue;
      }

      break;
    } while (attempts < maxAttempts);

    // Verificar que el archivo final no exceda 500KB (límite absoluto)
    if (processedBuffer.length > 500 * 1024) {
      throw new Error("No se pudo comprimir la imagen por debajo de 500KB");
    }

    // Convertir el Buffer a un Uint8Array para usarlo en el constructor de File
    const uint8Array = new Uint8Array(processedBuffer);

    const webpFile = new File([uint8Array], fileName, { type: "image/webp" });

    return webpFile;
  } catch (error) {
    console.error("Error converting image:", error);
    return null;
  }
}
