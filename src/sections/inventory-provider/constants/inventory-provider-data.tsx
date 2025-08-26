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

  // Campos principales - siempre incluidos
  formData.append("productId", String(product.productId || ""));
  formData.append("supplierId", String(product.supplierId || ""));

  // Validación de datos requeridos
  if (!product.productId) {
    throw new Error("productId is required");
  }
  if (!product.supplierId) {
    throw new Error("supplierId is required");
  }

  // Validar que existen storesWarehouses antes de procesar
  const storesWarehouses = product.storesWarehouses || [];

  if (storesWarehouses.length === 0) {
    throw new Error("Debes seleccionar al menos una tienda y almacén.");
  }

  // Validar que cada store tenga al menos un warehouse
  storesWarehouses.forEach((storeItem, index) => {
    if (!storeItem.storeId) {
      throw new Error(`Store ID requerido para storesWarehouses[${index}]`);
    }
    if (!storeItem.warehouseIds || storeItem.warehouseIds.length === 0) {
      throw new Error(
        `Al menos un warehouse requerido para storesWarehouses[${index}]`
      );
    }
  });

  storesWarehouses.forEach((storeItem, storeIndex) => {
    const baseKey = `storesWarehouses[${storeIndex}]`;

    // Store ID - siempre requerido
    formData.append(`${baseKey}[storeId]`, String(storeItem.storeId));

    // Warehouse IDs - siempre requerido al menos uno
    const warehouseIds = storeItem.warehouseIds || [];
    warehouseIds.forEach((warehouseId, warehouseIndex) => {
      formData.append(
        `${baseKey}[warehouseIds][${warehouseIndex}]`,
        String(warehouseId)
      );
    });

    // Product Variants
    const productVariants = storeItem.productVariants || [];
    productVariants.forEach((variant, variantIndex) => {
      const variantBaseKey = `${baseKey}[productVariants][${variantIndex}]`;

      // Serializar details (objeto/mapa)
      serializeVariantDetails(formData, variant.details, variantBaseKey);

      // Campos primitivos del variant
      serializePrimitiveFields(formData, variant, variantBaseKey);

      // Warranty (objeto)
      serializeWarranty(formData, variant.warranty, variantBaseKey);

      // Images (archivos o URLs)
      serializeImages(formData, variant.images as any, variantBaseKey);
    });
  });

  return formData;
};

/**
 * Serializa los details del variant (objeto/mapa)
 */
function serializeVariantDetails(
  formData: FormData,
  details: any,
  baseKey: string
): void {
  if (details && typeof details === "object" && !Array.isArray(details)) {
    Object.entries(details).forEach(([key, value]) => {
      const serializedValue = value == null ? "" : String(value);
      formData.append(`${baseKey}[details][${key}]`, serializedValue);
    });
  }
}

/**
 * Serializa los campos primitivos del variant
 */
function serializePrimitiveFields(
  formData: FormData,
  variant: any,
  baseKey: string
): void {
  const fields = [
    "quantity",
    "price",
    "discountType",
    "discountValue",
    "purchaseLimit",
    "isPrime",
    "packageDelivery",
  ];

  fields.forEach((field) => {
    if (variant[field] !== undefined && variant[field] !== null) {
      formData.append(`${baseKey}[${field}]`, String(variant[field]));
    }
  });
}

/**
 * Serializa el objeto warranty
 */
function serializeWarranty(
  formData: FormData,
  warranty: any,
  baseKey: string
): void {
  if (warranty && typeof warranty === "object" && !Array.isArray(warranty)) {
    Object.entries(warranty).forEach(([key, value]) => {
      const serializedValue = value == null ? "" : String(value);
      formData.append(`${baseKey}[warranty][${key}]`, serializedValue);
    });
  }
}

/**
 * Serializa las imágenes (archivos o URLs)
 */
function serializeImages(
  formData: FormData,
  images: any[],
  baseKey: string
): void {
  const imageArray = images || [];

  imageArray.forEach((image, imageIndex) => {
    const imageKey = `${baseKey}[images][${imageIndex}]`;

    if (image instanceof File) {
      formData.append(imageKey, image);
    } else if (image) {
      formData.append(imageKey, String(image));
    }
  });
}

/**
 * Valida los datos antes de la serialización
 */
export const validateInventoryData = (
  product: InventoryProviderFormData
): string[] => {
  const errors: string[] = [];

  if (!product.productId) errors.push("productId es requerido");
  if (!product.supplierId) errors.push("supplierId es requerido");

  if (!product.storesWarehouses || product.storesWarehouses.length === 0) {
    errors.push("Debes seleccionar al menos una tienda y almacén");
    return errors;
  }

  product.storesWarehouses.forEach((store, index) => {
    if (!store.storeId) {
      errors.push(`Store ID requerido para la tienda ${index + 1}`);
    }
    if (!store.warehouseIds || store.warehouseIds.length === 0) {
      errors.push(`Al menos un almacén requerido para la tienda ${index + 1}`);
    }
  });

  return errors;
};

// old version
/* export const setInventoryProviderFormData = async (
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
 */
