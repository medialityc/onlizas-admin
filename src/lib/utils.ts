import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Descarga un recurso desde una URL y lo convierte a File.
 * Si no se provee filename, intenta derivarlo de la URL o del mime type.
 */
export async function urlToFile(url: string, filename?: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`No se pudo descargar el archivo: ${res.status}`);
  const blob = await res.blob();

  const nameFromUrl = (() => {
    try {
      const u = new URL(url);
      const last = u.pathname.split("/").pop() || "document";
      return (last.split("?")[0] || last).trim();
    } catch {
      return "document";
    }
  })();

  const baseName =
    filename && filename.trim().length > 0 ? filename : nameFromUrl;
  const hasExt = /\.[a-zA-Z0-9]+$/.test(baseName);
  const ext =
    blob.type && !hasExt ? `.${blob.type.split("/")[1] || "bin"}` : "";

  const safeName = `${baseName}${hasExt ? "" : ext}`.replace(/\.+\.+/, ".");
  return new File([blob], safeName, {
    type: blob.type || "application/octet-stream",
  });
}
