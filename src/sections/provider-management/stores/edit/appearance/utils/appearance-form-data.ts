import { Store } from "@/types/stores";
import type { AppearanceForm } from "../schemas/appearance-schema";

type BuildAppearanceFormDataParams = {
  store: Store;
  data: AppearanceForm;
};

// Construye el FormData para actualizar tema y colores de la tienda
export function buildThemeFormData({ store, data }: BuildAppearanceFormDataParams) {
  const formData = new FormData();

  // Solo campos esenciales para el save
  formData.append("id", String(store.id));
  formData.append("name", store.name || "");
  formData.append("supplierId", String(store.supplierId));
  formData.append("active", store.active ? "true" : "false");

  // Campos de apariencia/tema - LO IMPORTANTE
  formData.append("primaryColor", data.primaryColor || "");
  formData.append("secondaryColor", data.secondaryColor || "");
  formData.append("accentColor", data.accentColor || "");
  formData.append("font", data.font || "");
  formData.append("template", data.template || "");

  /* // Solo agregar campos opcionales si existen
  if (store.description) formData.append("description", store.description);
  if (store.url) formData.append("url", store.url);
  if (store.email) formData.append("email", store.email);
  if (store.phoneNumber) formData.append("phoneNumber", store.phoneNumber);
  if (store.address) formData.append("address", store.address);
  if (store.logoStyle) formData.append("logoStyle", store.logoStyle);
 */
  return formData;
}

type BuildBannersFormDataParams = {
  banners: AppearanceForm["banners"];
  storeId?: string | number;
  filter?: (banner: AppearanceForm["banners"][number], index: number) => boolean;
  isUpdate?: boolean;
};

// Construye el FormData para banners
export async function buildBannersFormData({ banners, storeId, filter, isUpdate = false }: BuildBannersFormDataParams) {
  const formData = new FormData();

  // Helper: convierte File a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper: asegura formato ISO-8601 con hora para el backend
  const toIsoOrUndefined = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    if (/[Tt].*Z$/.test(value)) return value;
    try {
      return new Date(value).toISOString();
    } catch {
      return value; // fallback: enviar como viene
    }
  };

  const filteredBanners = banners.filter((b, idx) => (filter ? filter(b, idx) : true));

  // Procesar banners para incluir imágenes en metadata si es update
  const processedBanners = await Promise.all(filteredBanners.map(async (b) => {
    const metadata: any = {
      title: b.title ?? "",
      urlDestinity: b.urlDestinity ?? "",
      position: typeof b.position === "number" ? b.position : Number(b.position ?? 0),
      active: b.active ?? true,
    };

    if (b.id) {
      metadata.id = b.id;
    }

    if (storeId && (!b.id || (typeof b.id === "number" && b.id < 0))) {
      metadata.storeId = String(storeId);
    }

    const initDate = toIsoOrUndefined(b.initDate);
    if (initDate) {
      metadata.initDate = initDate;
    }
    const endDate = toIsoOrUndefined(b.endDate);
    if (endDate) {
      metadata.endDate = endDate;
    }

    // Para update, incluir imágenes en metadata como base64 o string
    if (isUpdate) {
      if (b.desktopImage instanceof File) {
        metadata.desktopImage = await fileToBase64(b.desktopImage);
      } else if (typeof b.desktopImage === "string") {
        metadata.desktopImage = b.desktopImage;
      }

      if (b.mobileImage instanceof File) {
        metadata.mobileImage = await fileToBase64(b.mobileImage);
      } else if (typeof b.mobileImage === "string") {
        metadata.mobileImage = b.mobileImage;
      }
    }

    return metadata;
  }));

  // 1. Añadir el array de metadatos como un string JSON
  formData.append("banners", JSON.stringify(processedBanners));

  // 2. Añadir las imágenes por separado solo si no es update
  if (!isUpdate) {
    filteredBanners.forEach((b, i) => {
      // Adjuntar imagen de escritorio si es un archivo
      const desktopImage = b.desktopImage;
      if (desktopImage instanceof File) {
        formData.append(`desktopImage`, desktopImage);
      }

      // Adjuntar imagen móvil si es un archivo
      const mobileImage = b.mobileImage;
      if (mobileImage instanceof File) {
        formData.append(`mobileImage`, mobileImage);
      }
    });
  }

  return formData;
}
