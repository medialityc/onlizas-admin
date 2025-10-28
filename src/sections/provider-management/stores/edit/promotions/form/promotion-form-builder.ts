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
    if (Array.isArray((data as any).dateRanges) && (data as any).dateRanges.length > 0) {
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

    if (Array.isArray((data as any).dateRanges) && (data as any).dateRanges.length > 0) {
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

    if (Array.isArray((data as any).dateRanges) && (data as any).dateRanges.length > 0) {
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
  const productVariantsIds: string[] = Array.isArray((data as any).productVariantsIds)
    ? (data as any).productVariantsIds.map((p: any) => String(p)).filter(Boolean)
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
    // Para code, usar directamente los valores numéricos del formulario
    discountType = Number((data as any).discountType ?? 1); // 1=amount por defecto
    discountValue = Number((data as any).discountValue ?? 0);
  } else if (promotionType === "order-value") {
    // Para order-value, usar directamente los valores numéricos del formulario
    discountType = Number((data as any).discountType ?? 1); // 1=amount por defecto
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
    code: promotionType === "code" ? (data as any).code ?? "" : "",
    mediaFile: "",
    usageLimit,
    categoriesIds,
    productVariantsIds,
  };

  // Construir FormData
  const formData = new FormData();
  formData.append("storeId", String(payload.storeId));
  formData.append("name", payload.name ?? "");
  formData.append("description", payload.description ?? "");
  formData.append("rangeDates", JSON.stringify(rangeDates));

  // Agregar promotionId si existe (para updates)
  if (promotionData?.id) {
    formData.append("promotionId", String(promotionData.id));
  }

  if (typeof payload.usageLimit === "number" && payload.usageLimit > 0) {
    formData.append("usageLimit", String(payload.usageLimit));
  }
  if (usageLimitPerUser > 0) {
    formData.append("usageLimitPerUser", String(usageLimitPerUser));
  }
  formData.append("productVariantsIds", JSON.stringify(payload.productVariantsIds ?? []));
  formData.append("categoriesIds", JSON.stringify(payload.categoriesIds ?? []));

  // Media file
  const mf = (data as any).mediaFile ?? (data as any).mediafile;
  if (mf instanceof File) {
    formData.append("mediaFile", mf);
  }

  // Discount fields - siempre agregar para code, order-value y otros tipos que los necesiten
  if (promotionType === "code" || promotionType === "order-value" || promotionType === "percentage" || promotionType === "fixed") {
    formData.append("discountType", String(payload.discountType));
    formData.append("discountValue", String(payload.discountValue));
  }

  // Code field para promociones de código
  if (promotionType === "code" && payload.code) {
    formData.append("code", payload.code);
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
