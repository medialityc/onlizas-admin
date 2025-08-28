import { Store } from "@/types/stores";
import type { StoreEditFormData } from "../../modals/store-edit-form.schema";

type BuildStoreFormDataParams = {
  store: Store;
  data: Partial<StoreEditFormData>; // RHF values
};

// Construye el FormData plano que exige el backend para actualizar/crear una tienda
export function buildStoreFormData({ store, data }: BuildStoreFormDataParams) {
  const formData = new FormData();
  // console.debug("buildStoreFormData", data);

  // Apariencia (aplanado)
  const primaryColor = data?.primaryColor ?? store.primaryColor ?? "";
  const secondaryColor = data?.secondaryColor ?? store.secondaryColor ?? "";
  const accentColor = data?.accentColor ?? store.accentColor ?? "";
  const font = data?.font ?? store.font ?? "";
  const template = data?.template ?? store.template ?? "";

  // Banners desde el form (aplanado)
//  const banners = Array.isArray(data?.banners) ? data.banners : [];

  // Logo: archivo si hay; si no, el string actual
  const isFileLike = (v: unknown): v is File =>
    typeof v === "object" && v !== null && "name" in (v as any) && "size" in (v as any) && "type" in (v as any);
  const logoAsFile = isFileLike(data?.logoStyle as unknown) ? (data?.logoStyle as File) : null;
  const logoAsString = logoAsFile ? null : (typeof data?.logoStyle === "string" ? data.logoStyle : store.logoStyle ?? "");
  if (logoAsFile) formData.append("logoStyle", logoAsFile);
  //else formData.append("logoStyle", logoAsString ?? "");

  // Campos escalares
  formData.append("id", String(store.id));
  formData.append("name", data?.name ?? store.name ?? "");
  formData.append("description", data?.description ?? store.description ?? "");
  formData.append("url", data?.url ?? store.url ?? "");
  formData.append("email", data?.email ?? store.email ?? "");
  formData.append("phoneNumber", data?.phoneNumber ?? store.phoneNumber ?? "");
  formData.append("address", data?.address ?? store.address ?? "");
  formData.append("returnPolicy", data?.returnPolicy ?? store.returnPolicy ?? "");
  formData.append("shippingPolicy", data?.shippingPolicy ?? store.shippingPolicy ?? "");
  formData.append("termsOfService", data?.termsOfService ?? store.termsOfService ?? "");
  formData.append("primaryColor", primaryColor);
  formData.append("secondaryColor", secondaryColor);
  formData.append("accentColor", accentColor);
  // Use values directly; they are already backend enums (e.g., ARIAL/ARGELIAN, MODERNO/...)
  formData.append("font", String(font));
  formData.append("template", String(template));
  formData.append("businessName", store.businessName ?? "");
  formData.append("supplierId", String(store.supplierId));
  formData.append("supplierName", store.supplierName ?? "");
  formData.append("isActive", (data?.isActive ?? store.isActive) ? "true" : "false");

  // Arreglos como JSON
  formData.append("followers", JSON.stringify(Array.isArray(store.followers) ? store.followers : []));
  /* formData.append(
    "banners",
    JSON.stringify(data.banners)
  ); */


  /* // Procesar banners con fechas ISO y enviarlos como campos bracketed: banner[0][id], banner[0][title], ...
  type BannerInput = NonNullable<StoreEditFormData["banners"]>[number] & {
    image?: File | string | null | undefined;
  };

  const toISO = (value: unknown): string => {
    if (!value) return new Date().toISOString();
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return new Date(value).toISOString();
    return new Date().toISOString();
  };

  const BANNER_FIELD = "banners"; // Cambia a "banner" si el backend lo requiere en singular
  const processedBanners: BannerInput[] = banners as BannerInput[];
  processedBanners.forEach((b, idx) => {
    const root = `${BANNER_FIELD}[${idx}]`;
    const id = typeof b.id === "number" ? b.id : 0;
    const position = typeof b.position === "string" ? parseInt(b.position, 10) : (b.position ?? 1);
    // Dot notation: banner[0].id, banner[0].title, ...
    formData.append(`${root}.id`, String(id));
    formData.append(`${root}.title`, b.title ?? "");
    formData.append(`${root}.urlDestinity`, b.urlDestinity ?? "");
    formData.append(`${root}.position`, String(Number.isFinite(position as number) ? position : 1));
    formData.append(`${root}.initDate`, toISO(b.initDate));
    formData.append(`${root}.endDate`, toISO(b.endDate));
    // Image: el backend espera un archivo. Solo enviar si el usuario seleccionó uno (File).
    if (isFileLike(b.image)) {
      formData.append(`${root}.image`, b.image as File);
    }
  });
 */
  if (Array.isArray(data?.categoriesPayload)) {
    formData.append("categories", JSON.stringify(data.categoriesPayload));
  }
  if (Array.isArray(data?.promotionsPayload)) {
    formData.append("promotions", JSON.stringify(data.promotionsPayload));
  }

  // Debug legible del FormData (clave: valor)
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
