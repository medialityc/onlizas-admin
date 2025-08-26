import { InventoryProviderFormData } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

/**
<<<<<<< HEAD
 * Serializa InventoryProviderFormData a FormData usando notación con corchetes:
 * storesWarehouses[0][storeId], storesWarehouses[0][warehouseIds][0],
 * storesWarehouses[0][productVariants][0][quantity], etc.
=======
 * Serializa InventoryProviderFormData a FormData compatible con .NET:
 * - storesWarehouses[0].storeId, storesWarehouses[0].warehouseIds[0]
 * - storesWarehouses[0].productVariants[0].quantity, etc.
>>>>>>> 01a2238 (fix issues)
 */
export const setInventoryProviderFormData = async (
  product: InventoryProviderFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Campos principales
  formData.append("productId", String(product.productId || ""));
  formData.append("supplierId", String(product.supplierId || ""));

  if (!product.productId) {
    throw new Error("productId is required");
  }
  if (!product.supplierId) {
    throw new Error("supplierId is required");
  }

  const storesWarehouses = product.storesWarehouses || [];
  if (storesWarehouses.length === 0) {
    throw new Error("Debes seleccionar al menos una tienda y almacén.");
  }

  storesWarehouses.forEach((storeItem, storeIndex) => {
    // Store ID - usar notación de array para .NET
    formData.append(
      `storesWarehouses[${storeIndex}].storeId`,
      String(storeItem.storeId)
    );

    // Warehouse IDs
    const warehouseIds = storeItem.warehouseIds || [];
    warehouseIds.forEach((warehouseId, warehouseIndex) => {
      formData.append(
        `storesWarehouses[${storeIndex}].warehouseIds[${warehouseIndex}]`,
        String(warehouseId)
      );
    });

    // Product Variants
    const productVariants = storeItem.productVariants || [];
    productVariants.forEach((variant, variantIndex) => {
      const variantBaseKey = `storesWarehouses[${storeIndex}].productVariants[${variantIndex}]`;

      // Detalles (CPU, RAM, etc.)
      if (variant.details && typeof variant.details === "object") {
        Object.entries(variant.details).forEach(([key, value]) => {
          const val = value == null ? "" : String(value);
          formData.append(`${variantBaseKey}.details.${key}`, val);
        });
      }

      // Campos primitivos - usar camelCase para que coincida con .NET
      const fieldMappings = {
        quantity: "quantity",
        price: "price",
        discountType: "discountType",
        discountValue: "discountValue",
        purchaseLimit: "purchaseLimit",
        isPrime: "isPrime",
        packageDelivery: "packageDelivery",
      };

      Object.entries(fieldMappings).forEach(([jsField, netField]) => {
        const value = variant[jsField as keyof typeof variant];
        if (value !== undefined && value !== null) {
          formData.append(`${variantBaseKey}.${netField}`, String(value));
        }
      });

      // Warranty
      if (variant.warranty && typeof variant.warranty === "object") {
        Object.entries(variant.warranty).forEach(([key, value]) => {
          const val = value == null ? "" : String(value);
          formData.append(`${variantBaseKey}.warranty.${key}`, val);
        });
      }

      // Imágenes
      const images = variant.images || [];
      images.forEach((image, imageIndex) => {
        const imageKey = `${variantBaseKey}.images[${imageIndex}]`;
        if (image instanceof File) {
          formData.append(imageKey, image);
        } else if (typeof image === "string") {
          // Si es URL como string
          formData.append(imageKey, image);
        }
      });
    });
  });

  return formData;
};

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
