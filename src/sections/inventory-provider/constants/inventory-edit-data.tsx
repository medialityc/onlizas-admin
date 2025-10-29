import { isFileLike } from "@/utils/is-file";
import { ProductVariant } from "../schemas/inventory-provider.schema";
import { processImageFile } from "@/utils/image-helpers";
import { toast } from "react-toastify";

export async function buildCreateProductVariantFormData(
  input: ProductVariant
): Promise<FormData> {
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

  console.log("input images", input.images);

  // Images
  if (input?.images?.length) {
    for (let index = 0; index < input.images.length; index++) {
      const f = input.images[index];
      if (isFileLike(f)) {
        const processedImage = await processImageFile(f);
        if (processedImage) {
          fd.append(`images[${index}]`, processedImage);
        } else {
          toast.error("Error al procesar la imagen");
        }
      }
    }
  }

  return fd;
}
