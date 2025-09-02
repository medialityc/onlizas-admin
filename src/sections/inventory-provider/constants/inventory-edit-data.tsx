import { ProductVariant } from "../schemas/inventory-provider.schema";

export function buildCreateProductVariantFormData(
  input: ProductVariant
): FormData {
  const fd = new FormData();

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

  if (input.quantity !== undefined)
    fd.append("Quantity", String(input.quantity));
  if (input.price !== undefined) fd.append("Price", String(input.price));
  if (input.purchaseLimit !== undefined)
    fd.append("PurchaseLimit", String(input.purchaseLimit));
  if (input.isPrime !== undefined) fd.append("IsPrime", String(input.isPrime));
  if (input.packageDelivery !== undefined)
    fd.append("PackageDelivery", String(input.packageDelivery));

  // Warranty: nested object -> Warranty.PropName (dot notation works with ASP.NET model binding)
  if (input.warranty && typeof input.warranty === "object") {
    Object.entries(input.warranty).forEach(([k, v]) => {
      if (v === undefined || v === null) {
        fd.append(`Warranty.${k}`, "");
      } else if (Array.isArray(v)) {
        // arrays -> append multiple entries with same key (or serialize if needed)
        v.forEach((item) => fd.append(`Warranty.${k}`, String(item)));
      } else {
        fd.append(`Warranty.${k}`, String(v));
      }
    });
  }

  // Images: validate size <= 5MB and append every File under key "Images" (IFormFile list)
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (Array.isArray(input.images)) {
    const oversized: string[] = [];
    input.images.forEach((f) => {
      if (f instanceof File) {
        if (f.size > MAX_IMAGE_SIZE) {
          oversized.push(f.name ?? "unnamed");
        } else {
          fd.append("Images", f);
        }
      } else if (typeof f === "string") {
        // if the UI may pass existing image URLs as strings, consider sending them as text fields
        fd.append("ImagesUrls", f); // optional: backend must accept this
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
