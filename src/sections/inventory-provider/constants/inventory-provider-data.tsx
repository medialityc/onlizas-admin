import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

/**
 * Serializa InventoryProviderFormData a FormData usando notación con corchetes:
 * storesWarehouses[0][storeId], storesWarehouses[0][warehouseIds][0],
 * storesWarehouses[0][productVariants][0][quantity], etc.
 */
export const setInventoryProviderFormData = async (
  product: InventoryProviderFormData
): Promise<FormData> => {
  const formData = new FormData();

  formData.append("productId", String(product.productId));
  formData.append("supplierId", String(product.supplierId));

  // storesWarehouses es un array
  (product.storesWarehouses || []).forEach((storeItem, si) => {
    const base = `storesWarehouses[${si}]`;
    formData.append(`${base}[storeId]`, String(storeItem.storeId));

    // warehouseIds (ya deben venir combinados si pasaron por el schema)
    (storeItem.warehouseIds || []).forEach((wid, wi) => {
      formData.append(`${base}[warehouseIds][${wi}]`, String(wid));
    });

    // productVariants
    (storeItem.productVariants || []).forEach((variant, pv) => {
      const vBase = `${base}[productVariants][${pv}]`;

      // details: puede ser un objeto (mapa) resultante de la transformación
      if (
        variant.details &&
        typeof variant.details === "object" &&
        !Array.isArray(variant.details)
      ) {
        Object.keys(variant.details).forEach((key) => {
          const value = (variant.details as Record<string, any>)[key];
          formData.append(
            `${vBase}[details][${key}]`,
            value == null ? "" : String(value)
          );
        });
      }

      // Campos primitivos
      if (variant.quantity !== undefined)
        formData.append(`${vBase}[quantity]`, String(variant.quantity));
      if (variant.price !== undefined)
        formData.append(`${vBase}[price]`, String(variant.price));
      if (variant.discountType !== undefined)
        formData.append(`${vBase}[discountType]`, String(variant.discountType));
      if (variant.discountValue !== undefined)
        formData.append(
          `${vBase}[discountValue]`,
          String(variant.discountValue)
        );
      if (variant.purchaseLimit !== undefined)
        formData.append(
          `${vBase}[purchaseLimit]`,
          String(variant.purchaseLimit)
        );
      if (variant.isPrime !== undefined)
        formData.append(`${vBase}[isPrime]`, String(variant.isPrime));
      if (variant.packageDelivery !== undefined)
        formData.append(
          `${vBase}[packageDelivery]`,
          String(variant.packageDelivery)
        );

      // warranty (objeto)
      if (variant.warranty && typeof variant.warranty === "object") {
        const w = variant.warranty as Record<string, any>;
        Object.keys(w).forEach((wk) => {
          const wv = w[wk];
          formData.append(
            `${vBase}[warranty][${wk}]`,
            wv == null ? "" : String(wv)
          );
        });
      }

      // images: pueden ser strings (URL) o File
      (variant.images || []).forEach((img, im) => {
        if (img instanceof File) {
          formData.append(`${vBase}[images][${im}]`, img);
        } else {
          formData.append(`${vBase}[images][${im}]`, String(img));
        }
      });
    });
  });

  return formData;
};
