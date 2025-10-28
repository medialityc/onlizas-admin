import { ProductVariant } from "../schemas/inventory-provider.schema";

export function buildCreateProductVariantFormData(
  input: ProductVariant
): FormData {
  const fd = new FormData();

  // ID del producto variante
  if (input.id !== undefined) fd.append("id", String(input.id));

  // SKU
  if (input.sku) fd.append("sku", input.sku);

  // Details: objeto serializado
  if (input.details && typeof input.details === "object") {
    const detailsObj: Record<string, string> = {};
    Object.entries(input.details).forEach(([key, value]) => {
      const val =
        value == null
          ? ""
          : typeof value === "object" && "value" in value
            ? ((value as any).value ?? "")
            : String(value);
      detailsObj[key] = val;
    });
    fd.append("details", JSON.stringify(detailsObj));
  }

  // Quantity & Price
  if (input.stock !== undefined) fd.append("stock", String(input.stock));
  if (input.price !== undefined) fd.append("price", String(input.price));

  // Purchase limit & flags
  if (input.purchaseLimit !== undefined)
    fd.append("purchaseLimit", String(input.purchaseLimit));
  if (input.isLimit !== undefined)
    fd.append("isLimit", input.isLimit ? "true" : "false");
  if (input.isPrime !== undefined)
    fd.append("isPrime", input.isPrime ? "true" : "false");
  if (input.isActive !== undefined)
    fd.append("isActive", input.isActive ? "true" : "false");
  if (input.packageDelivery !== undefined)
    fd.append("packageDelivery", input.packageDelivery ? "true" : "false");

  // Volume & Weight (paquetería)
  if (input.volume !== undefined) fd.append("volume", String(input.volume));
  if (input.weight !== undefined) fd.append("weight", String(input.weight));

  // Warranty
  if (input.warranty && typeof input.warranty === "object") {
    Object.entries(input.warranty).forEach(([k, v]) => {
      if (v === undefined || v === null) {
        fd.append(`warranty.${k}`, "");
      } else {
        fd.append(`warranty.${k}`, String(v));
      }
    });
  }

  // Images
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (Array.isArray(input.images)) {
    const oversized: string[] = [];
    input.images.forEach((f) => {
      if (f instanceof File) {
        if (f.size > MAX_IMAGE_SIZE) {
          oversized.push(f.name ?? "unnamed");
        } else {
          fd.append("images", f);
        }
      } else if (typeof f === "string") {
        fd.append("imagesUrls", f); // si el backend acepta URLs
      }
    });
    if (oversized.length) {
      throw new Error(
        `Las siguientes imágenes exceden el tamaño máximo de 5MB: ${oversized.join(
          ", "
        )}`
      );
    }
  }

  return fd;
}
