import type { FreeDeliveryFormData } from "../schemas/free-delivery-schema";
import type { PromotionRequest, Promotion } from "@/types/promotions";

/**
 * Función para construir FormData para promociones, reutilizable para diferentes tipos.
 * Usa condicionales para campos específicos por tipo.
 */
export function buildPromotionFormData(
  data: any,
  storeId: string, // Cambiado a string para GUIDs
  promotionType: string,
  promotionData?: Promotion
): FormData {
  // Initialize rangeDates array (no longer using startDate/endDate from form root)
  const rangeDates: Array<{ startDate: string; endDate: string }> = [];

  // Campos específicos por tipo
  if (promotionType === "free-delivery") {
    // Para free-delivery, agregar simpleDates a rangeDates
    if (Array.isArray(data.simpleDates) && data.simpleDates.length > 0) {
      data.simpleDates.forEach((entry: string | Date) => {
        // Acepta tanto Date como string; new Date(...) funciona con ambos
        const simpleDate = new Date(entry as any);
        if (!isNaN(simpleDate.getTime())) {
          simpleDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
          const isoDate = simpleDate.toISOString();
          rangeDates.push({
            startDate: isoDate,
            endDate: isoDate, // Mismo día para fechas simples
          });
        }
      });
    }

    // Agregar rangos de fechas complejos (múltiples días)
    if (
      Array.isArray((data as any).dateRanges) &&
      (data as any).dateRanges.length > 0
    ) {
      (data as any).dateRanges.forEach((range: any) => {
        if (range && range.startDate && range.endDate) {
          const startDate = new Date(range.startDate);
          const endDate = new Date(range.endDate);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            startDate.setHours(0, 0, 0, 0); // Inicio del día
            endDate.setHours(23, 59, 59, 999); // Fin del día

            rangeDates.push({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            });
          }
        }
      });
    }
  }

  // Code promotions
  if (promotionType === "code") {
    // Para code, procesar fechas de la misma manera que free-delivery
    if (Array.isArray(data.simpleDates) && data.simpleDates.length > 0) {
      data.simpleDates.forEach((entry: string | Date) => {
        const simpleDate = new Date(entry as any);
        if (!isNaN(simpleDate.getTime())) {
          simpleDate.setHours(0, 0, 0, 0);
          const isoDate = simpleDate.toISOString();
          rangeDates.push({
            startDate: isoDate,
            endDate: isoDate,
          });
        }
      });
    }

    if (
      Array.isArray((data as any).dateRanges) &&
      (data as any).dateRanges.length > 0
    ) {
      (data as any).dateRanges.forEach((range: any) => {
        if (range && range.startDate && range.endDate) {
          const startDate = new Date(range.startDate);
          const endDate = new Date(range.endDate);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            rangeDates.push({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            });
          }
        }
      });
    }
  }

  // Order value promotions
  if (promotionType === "order-value") {
    // Para order-value, procesar fechas de la misma manera que free-delivery
    if (Array.isArray(data.simpleDates) && data.simpleDates.length > 0) {
      data.simpleDates.forEach((entry: string | Date) => {
        const simpleDate = new Date(entry as any);
        if (!isNaN(simpleDate.getTime())) {
          simpleDate.setHours(0, 0, 0, 0);
          const isoDate = simpleDate.toISOString();
          rangeDates.push({
            startDate: isoDate,
            endDate: isoDate,
          });
        }
      });
    }

    if (
      Array.isArray((data as any).dateRanges) &&
      (data as any).dateRanges.length > 0
    ) {
      (data as any).dateRanges.forEach((range: any) => {
        if (range && range.startDate && range.endDate) {
          const startDate = new Date(range.startDate);
          const endDate = new Date(range.endDate);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            rangeDates.push({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            });
          }
        }
      });
    }
  }

  // Inventory promotions
  if (promotionType === "inventory") {
    // Para inventory, procesar fechas de la misma manera que otros tipos
    if (Array.isArray(data.simpleDates) && data.simpleDates.length > 0) {
      data.simpleDates.forEach((entry: string | Date) => {
        const simpleDate = new Date(entry as any);
        if (!isNaN(simpleDate.getTime())) {
          simpleDate.setHours(0, 0, 0, 0);
          const isoDate = simpleDate.toISOString();
          rangeDates.push({
            startDate: isoDate,
            endDate: isoDate,
          });
        }
      });
    }

    if (
      Array.isArray((data as any).dateRanges) &&
      (data as any).dateRanges.length > 0
    ) {
      (data as any).dateRanges.forEach((range: any) => {
        if (range && range.startDate && range.endDate) {
          const startDate = new Date(range.startDate);
          const endDate = new Date(range.endDate);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            rangeDates.push({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            });
          }
        }
      });
    }
  }

  // Package promotions
  if (promotionType === "package") {
    // Para package, procesar fechas de la misma manera que inventory
    if (Array.isArray(data.simpleDates) && data.simpleDates.length > 0) {
      data.simpleDates.forEach((entry: string | Date) => {
        const simpleDate = new Date(entry as any);
        if (!isNaN(simpleDate.getTime())) {
          simpleDate.setHours(0, 0, 0, 0);
          const isoDate = simpleDate.toISOString();
          rangeDates.push({
            startDate: isoDate,
            endDate: isoDate,
          });
        }
      });
    }

    if (
      Array.isArray((data as any).dateRanges) &&
      (data as any).dateRanges.length > 0
    ) {
      (data as any).dateRanges.forEach((range: any) => {
        if (range && range.startDate && range.endDate) {
          const startDate = new Date(range.startDate);
          const endDate = new Date(range.endDate);

          if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            rangeDates.push({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            });
          }
        }
      });
    }
  }

  // Normalize arrays - mantener como strings para GUIDs
  const productVariantsIds: string[] = Array.isArray(
    (data as any).productVariantsIds
  )
    ? (data as any).productVariantsIds
        .map((p: any) => String(p))
        .filter(Boolean)
    : [];

  const categoriesIds = Array.isArray((data as any).categoriesIds)
    ? (data as any).categoriesIds.map((c: any) => String(c)).filter(Boolean)
    : [];

  const usageLimit = Number((data as any).usageLimit ?? 0);
  const usageLimitPerUser = Number((data as any).usageLimitPerUser ?? 0);

  // Determinar discountType y discountValue según el tipo de promoción
  let discountType: number;
  let discountValue: number;

  if (promotionType === "free-delivery") {
    discountType = 2; // free
    discountValue = 0;
  } else if (promotionType === "code") {
    // Para code, mapear valores del frontend al backend
    const frontendType = Number((data as any).discountType ?? 1); // del ValueSelector
    // Mapear: 0->1 (percent->Porcentaje), 1->2 (amount->MontoFijo)
    discountType = frontendType === 0 ? 1 : frontendType === 1 ? 2 : 1;
    discountValue = Number((data as any).discountValue ?? 0);
  } else if (promotionType === "order-value") {
    // Para order-value, mapear valores del frontend al backend
    const frontendType = Number((data as any).discountType ?? 1); // del ValueSelector
    // Mapear: 0->1 (percent->Porcentaje), 1->2 (amount->MontoFijo)
    discountType = frontendType === 0 ? 1 : frontendType === 1 ? 2 : 1;
    discountValue = Number((data as any).discountValue ?? 0);
  } else if (promotionType === "package") {
    // Para package, mapear valores del frontend al backend
    const frontendType = Number((data as any).discountType ?? 0); // del ValueSelector
    // Mapear: 0->1 (percent->Porcentaje), 1->2 (amount->MontoFijo)
    discountType = frontendType === 0 ? 1 : frontendType === 1 ? 2 : 1;
    discountValue = Number((data as any).discountValue ?? 0);
  } else if (promotionType === "inventory") {
    // Para inventory, mapear valores del frontend al backend
    const frontendType = Number((data as any).discountType ?? 0); // 0=percent, 1=amount del frontend
    // Mapear a backend: 0->1 (percent->Porcentaje), 1->2 (amount->MontoFijo)
    discountType = frontendType === 0 ? 1 : frontendType === 1 ? 2 : 1;
    discountValue = Number((data as any).discountValue ?? 0);
  } else {
    discountType = 1; // amount por defecto
    discountValue = Number((data as any).discountValue ?? 0);
  }

  // Payload base (removed startDate/endDate since we use rangeDates array)
  const payload: Partial<PromotionRequest> = {
    id: promotionData?.id ? String(promotionData.id) : undefined, // Convertir a string
    storeId: storeId, // Ya es string
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    discountType,
    discountValue,
    code:
      promotionType === "code" || promotionType === "inventory"
        ? ((data as any).code ?? "")
        : "",
    mediaFile: "",
    usageLimit,
    categoriesIds,
    productVariantsIds,
  };

  // Construir FormData
  const formData = new FormData();
  formData.append("StoreId", String(payload.storeId)); // Capitalizado según docs
  formData.append("Name", payload.name ?? ""); // Capitalizado según docs
  formData.append("Description", payload.description ?? ""); // Capitalizado según docs

  // Para inventory y package, enviar StartDate y EndDate separados como espera el backend
  if (
    (promotionType === "inventory" || promotionType === "package") &&
    rangeDates.length > 0
  ) {
    formData.append("StartDate", rangeDates[0].startDate);
    formData.append("EndDate", rangeDates[0].endDate);
  } else {
    // Para otros tipos, usar rangeDates
    formData.append("rangeDates", JSON.stringify(rangeDates));
  }

  // Agregar promotionId si existe (para updates)
  if (promotionData?.id) {
    formData.append("promotionId", String(promotionData.id));
  }

  if (typeof payload.usageLimit === "number" && payload.usageLimit > 0) {
    formData.append("UsageLimit", String(payload.usageLimit)); // Capitalizado según docs
  }
  if (usageLimitPerUser > 0) {
    formData.append("UsageLimitPerUser", String(usageLimitPerUser)); // Capitalizado según docs
  }

  // Para package, usar ProductVariantIds según docs
  if (promotionType === "package") {
    formData.append(
      "ProductVariantIds",
      JSON.stringify(payload.productVariantsIds ?? [])
    );
    formData.append(
      "IsFreeDelivery",
      String(discountType === 3 ? true : false)
    ); // Campo requerido
    // Campos opcionales para package
    if ((data as any).minimumAmount && (data as any).minimumAmount > 0) {
      formData.append("MinPurchaseAmount", String((data as any).minimumAmount));
    }
    if ((data as any).minimumItems && (data as any).minimumItems > 0) {
      formData.append("MinProductQuantity", String((data as any).minimumItems));
    }
  } else {
    formData.append(
      "productVariantsIds",
      JSON.stringify(payload.productVariantsIds ?? [])
    );
    formData.append(
      "categoriesIds",
      JSON.stringify(payload.categoriesIds ?? [])
    );
  }

  // Media file
  const mf = (data as any).mediaFile ?? (data as any).mediafile;
  if (mf instanceof File) {
    if (promotionType === "package") {
      formData.append("MediaFile", mf); // Capitalizado para package según docs
    } else {
      formData.append("mediaFile", mf);
    }
  }

  // Discount fields - para package usar nombres capitalizados según docs
  if (promotionType === "package") {
    formData.append("DiscountType", String(payload.discountType));
    formData.append("DiscountValue", String(payload.discountValue));
  } else if (
    promotionType === "code" ||
    promotionType === "order-value" ||
    promotionType === "inventory" ||
    promotionType === "percentage" ||
    promotionType === "fixed"
  ) {
    formData.append("discountType", String(payload.discountType));
    formData.append("discountValue", String(payload.discountValue));
  }

  // Code field para promociones que lo requieren
  if (promotionType === "package" && payload.code) {
    formData.append("Code", payload.code); // Capitalizado para package
  } else if (
    (promotionType === "code" || promotionType === "inventory") &&
    payload.code
  ) {
    formData.append("code", payload.code);
  }

  // RequiresCode field
  if (promotionType === "package") {
    formData.append(
      "RequiresCode",
      String(Boolean((data as any).requiresCode))
    );
  } else if (promotionType === "inventory" || promotionType === "code") {
    formData.append(
      "RequiresCode",
      String(Boolean((data as any).requiresCode))
    );
  }

  // Campos específicos adicionales por tipo
  if (promotionType === "percentage") {
    formData.append("discountValue", String((data as any).discountValue ?? 0));
  }

  // Campos para requisitos de compra (comunes a todos los tipos)
  if ((data as any).minimumAmount && (data as any).minimumAmount > 0) {
    formData.append("minPurchaseAmount", String((data as any).minimumAmount));
  }
  if ((data as any).minimumItems && (data as any).minimumItems > 0) {
    formData.append("minProductQuantity", String((data as any).minimumItems));
  }
  if ((data as any).productIdX && (data as any).productIdY) {
    formData.append("productIdX", String((data as any).productIdX));
    formData.append("productIdY", String((data as any).productIdY));
    formData.append("discountTypeY", String((data as any).discountType));
    formData.append("discountValueY", String((data as any).discountValue));
    formData.append("quantityX", String((data as any).minimumAmount));
  }

  return formData;
}
