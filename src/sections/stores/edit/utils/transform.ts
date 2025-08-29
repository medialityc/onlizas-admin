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
  //formData.append("primaryColor", primaryColor);
  //formData.append("secondaryColor", secondaryColor);
  //formData.append("accentColor", accentColor);
  // Use values directly; they are already backend enums (e.g., ARIAL/ARGELIAN, MODERNO/...)
  //formData.append("font", String(font));
  //formData.append("template", String(template));
  formData.append("businessName", store.businessName ?? "");
  formData.append("supplierId", String(store.supplierId));
  formData.append("supplierName", store.supplierName ?? "");
  formData.append("isActive", (data?.isActive ?? store.isActive) ? "true" : "false");

  // Arreglos como JSON
  //formData.append("followers", JSON.stringify(Array.isArray(store.followers) ? store.followers : []));
  /* formData.append(
    "banners",
    JSON.stringify(data.banners)
  ); */
  

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
