import { Store } from "@/types/stores";
import type { StoreEditFormData } from "../../modals/store-edit-form.schema";

type BuildStoreFormDataParams = {
  store: Store;
  data: Partial<StoreEditFormData>; // RHF values
};

// Construye el FormData plano que exige el backend para actualizar/crear una tienda
export function buildStoreFormData({ store, data }: BuildStoreFormDataParams) {
  const formData = new FormData();
  console.log("Estoy en tranforms", data)

  // Apariencia (aplanado)
  const primaryColor = data?.primaryColor ?? store.primaryColor ?? "";
  const secondaryColor = data?.secondaryColor ?? store.secondaryColor ?? "";
  const accentColor = data?.accentColor ?? store.accentColor ?? "";
  const font = data?.font ?? store.font ?? "";
  const template = data?.template ?? store.template ?? "";

  // Banners desde el form (aplanado)
  const banners = Array.isArray(data?.banners) ? data.banners : [];
  console.log("Banners in transform:", banners); // Debug para ver la estructura

  // Logo: archivo si hay; si no, el string actual
  const isFileLike = (v: any): v is { name: string; size: number; type: string } =>
    typeof v === "object" && v !== null && typeof (v as any).name === "string" && typeof (v as any).size === "number";
  const logoAsFile = isFileLike(data?.logoStyle) ? (data.logoStyle as any) : null;
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

  // Procesar banners con fechas en formato ISO correcto para el backend
  const processedBanners = banners.map((banner: any) => {
    // Función helper para convertir fecha a ISO string
    const toISOString = (date: any): string => {
      if (!date) return new Date().toISOString();
      if (date instanceof Date) return date.toISOString();
      if (typeof date === 'string') return new Date(date).toISOString();
      return new Date().toISOString();
    };

    return {
      id: banner.id || 0,
      title: banner.title || "",
      urlDestinity: banner.urlDestinity || "",
      position: Number(banner.position) || 1,
      initDate: toISOString(banner.initDate),
      endDate: toISOString(banner.endDate),
      image: (banner.image && typeof banner.image === 'object' && 'name' in banner.image) ? 
             banner.image.name : (banner.image || "")
    };
  });
  
  formData.append("banners", JSON.stringify(processedBanners));
  console.log("Banners payload enviado:", JSON.stringify(processedBanners, null, 2));


  if (Array.isArray(data?.categoriesPayload)) {
    formData.append("categories", JSON.stringify(data.categoriesPayload));
  }
  if (Array.isArray(data?.promotionsPayload)) {
    formData.append("promotions", JSON.stringify(data.promotionsPayload));
  }

  return formData;
}
