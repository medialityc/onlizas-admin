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
  formData.append("isActive", store.isActive ? "true" : "false");

  // Campos de apariencia/tema - LO IMPORTANTE
  formData.append("primaryColor", data.primaryColor || "");
  formData.append("secondaryColor", data.secondaryColor || "");
  formData.append("accentColor", data.accentColor || "");
  formData.append("font", data.font || "");
  formData.append("template", data.template || "");

  // Solo agregar campos opcionales si existen
  if (store.description) formData.append("description", store.description);
  if (store.url) formData.append("url", store.url);
  if (store.email) formData.append("email", store.email);
  if (store.phoneNumber) formData.append("phoneNumber", store.phoneNumber);
  if (store.address) formData.append("address", store.address);
  if (store.logoStyle) formData.append("logoStyle", store.logoStyle);

  return formData;
}

type BuildBannersFormDataParams = {
  banners: AppearanceForm["banners"];
  filter?: (banner: AppearanceForm["banners"][number], index: number) => boolean;
};

// Construye el FormData para banners
export function buildBannersFormData({ banners, filter }: BuildBannersFormDataParams) {
  const entries = banners
    .map((b, idx) => ({ b, idx }))
    .filter(({ b, idx }) => (filter ? filter(b, idx) : true));

  const bannersData = entries.map(({ b }) => ({
    // Solo incluir ID si es positivo (del backend), ignorar IDs temporales negativos
    ...(b.id && b.id > 0 ? { id: b.id } : {}),
    title: b.title,
    urlDestinity: b.urlDestinity,
    position: b.position,
    initDate: b.initDate,
    endDate: b.endDate,
    isActive: b.isActive,
  }));

  const formData = new FormData();
  formData.append("banners", JSON.stringify(bannersData));

  // Agregar imágenes
  entries.forEach(({ b }) => {
    if (b.image instanceof File) {
      formData.append("images", b.image);
    }
  });

  try {
    const lines: string[] = [];
    for (const [key, value] of Array.from(formData.entries())) {
      if (value instanceof File) {
        lines.push(`${key}: [File name=${value.name} size=${value.size} type=${value.type}]`);
      } else {
        lines.push(`${key}: ${String(value)}`);
      }
    }
    console.log("FormData (flattened):\n" + lines.join("\n"));
  } catch {}

  return formData;
}
