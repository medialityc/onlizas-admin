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
  storeId?: number; // 🔧 Opcional - solo para CREATE
  filter?: (banner: AppearanceForm["banners"][number], index: number) => boolean;
};

// Construye el FormData para banners
export function buildBannersFormData({ banners, storeId, filter }: BuildBannersFormDataParams) {
  
  // Helper: asegura formato ISO-8601 con hora para el backend
  const toIsoOrUndefined = (value?: string | null): string | undefined => {
    if (!value) return undefined;
    // Si ya parece ISO con tiempo, devuelve tal cual
    if (/[Tt].*Z$/.test(value)) return value;
    try {
      return new Date(value).toISOString();
    } catch {
      return value; // fallback: enviar como viene
    }
  };

  const entries = banners
    .map((b, idx) => ({ b, idx }))
    .filter(({ b, idx }) => (filter ? filter(b, idx) : true));

  const bannersData = entries.map(({ b }) => ({
    // Solo incluir ID si es positivo (del backend), ignorar IDs temporales negativos
    ...(b.id && b.id > 0 ? { id: b.id } : {}),

    // 🔧 IMPORTANTE: Agregar storeId SOLO para banners nuevos (CREATE)
    ...(storeId && (!b.id || b.id < 0) ? { storeId } : {}),

    title: b.title,
    urlDestinity: b.urlDestinity,
    position: typeof b.position === "number" ? b.position : Number(b.position ?? 0),
    initDate: toIsoOrUndefined(b.initDate),
    endDate: toIsoOrUndefined(b.endDate),
    active: b.active ?? true,
  }));
  const formData = new FormData();
  const bannersPayload = bannersData.length === 1 ? bannersData[0] : bannersData;
  formData.append("banners", JSON.stringify(bannersPayload));
  // Agregar imágenes
  let appended = 0;
  entries.forEach(({ b }, i) => {
    const isFile = b.image instanceof File;
    
    if (isFile) {
      formData.append("images", b.image as File);
      console.log("es file en el fomrdata")
      appended++;
    } /* else if (b.image != null) {
      // If image is a URL/base64 string, append as text
      formData.append("images",b.image);
      appended++;
    } */
  });

  // Use Array.from to avoid requiring --downlevelIteration or ES2015 target
  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(key, value);
  });

  console.log("🖼️ Total images appended:", appended);

  return formData;
}
