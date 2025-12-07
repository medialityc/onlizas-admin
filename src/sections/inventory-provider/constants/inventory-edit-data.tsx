import { isFileLike } from "@/utils/is-file";
import { ProductVariant } from "../schemas/inventory-provider.schema";
import { processImageFile } from "@/utils/image-helpers";
import { toast } from "react-toastify";

// FormData builder para crear/editar variantes (según Swagger)
export async function buildCreateProductVariantFormData(
  input: ProductVariant
): Promise<FormData> {
  const fd = new FormData();

  if (input.sku) fd.append("sku", input.sku);
  if (input.upc) fd.append("upc", input.upc);
  if (input.ean) fd.append("ean", input.ean);

  if (input.details && typeof input.details === "object") {
    const d: Record<string, string> = {};

    Object.entries(input.details).forEach(([key, value]) => {
      const val =
        value == null
          ? ""
          : typeof value === "object" && "value" in value
          ? ((value as any).value ?? "")
          : String(value);

      d[key] = val;
    });

    fd.append("details", JSON.stringify(d));
  }

  // STOCK & PRICE
  if (input.stock !== undefined) fd.append("stock", String(input.stock));
  if (input.price !== undefined) fd.append("price", String(input.price));
  if (input.costPrice !== undefined) fd.append("costPrice", String(input.costPrice));

  // PURCHASE LIMIT
  if (input.purchaseLimit !== undefined)
    fd.append("purchaseLimit", String(input.purchaseLimit));

  fd.append("isPrime", input.isPrime ? "true" : "false");
  fd.append("isActive", input.isActive ? "true" : "false");
  fd.append("packageDelivery", input.packageDelivery ? "true" : "false");

 
  fd.append("volume", String(input.volume ?? 0));
  fd.append("weight", String(input.weight ?? 0));
  if (input.condition !== undefined)
    fd.append("condition", String(input.condition));

 
  fd.append(
    "warranty",
    JSON.stringify({
      isWarranty: input.warranty?.isWarranty ?? false,
      warrantyTime: input.warranty?.warrantyTime ?? 0,
      warrantyPrice: input.warranty?.warrantyPrice ?? 0,
    })
  );

  if (input.zoneIds?.length) {
    const zoneIdsString = input.zoneIds.join(",");
    console.log("📍 Enviando zoneIds como string:", zoneIdsString);
    fd.append("zoneIds", zoneIdsString);
  }

  if (input.deliveryMode) {
    const deliveryType = input.deliveryMode === "PROVEEDOR" ? 1 : 0;
    fd.append("deliveryType", String(deliveryType));
  }

  /* ------------------------------------------------------
     IMAGES - corregido
     Swagger espera:  
       images=...
       images=...
       images=...
  ------------------------------------------------------ */
  if (input.images?.length) {
    for (const img of input.images) {
      if (isFileLike(img)) {
        const processed = await processImageFile(img);
        if (processed) {
          fd.append("images", processed);
        } else {
          toast.error("Error al procesar la imagen");
        }
      } else if (typeof img === "string") {
        fd.append("images", img);
      }
    }
  }

  return fd;
}

