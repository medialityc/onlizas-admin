import type { Promotion } from "@/types/promotions";

/**
 * Función para obtener defaultValues comunes a todos los formularios de promociones.
 * Mapea campos del backend (Promotion) a los nombres usados en los formularios.
 */
export function getCommonDefaultValues(promotionData?: Promotion) {
  return {
    // Información básica
    name: promotionData?.name ?? "",
    description: promotionData?.description ?? "",
    mediaFile: promotionData?.mediaFile ?? "",
    //promotionType:promotionData?.promotionType??'',

    // Fechas simples (extraer de dateRangesDTOs si existen rangos de un solo día)
    simpleDates: (() => {
      const ranges = promotionData?.dateRangesDTOs ?? [];
      return ranges
        .filter(r => {
          if (!r || !r.startDate || !r.endDate) return false;
          const startStr = new Date(r.startDate).toDateString();
          const endStr = new Date(r.endDate).toDateString();
          return startStr === endStr;
        })
        .map(r => new Date(r.startDate));
    })(),

    // Rangos de fechas complejos (extraer rangos que no son de un solo día)
    dateRanges: (() => {
      const ranges = promotionData?.dateRangesDTOs ?? [];
      return ranges
        .filter(r => {
          if (!r || !r.startDate || !r.endDate) return false;
          const startStr = new Date(r.startDate).toDateString();
          const endStr = new Date(r.endDate).toDateString();
          return startStr !== endStr; // Solo rangos que abarcan múltiples días
        })
        .map(r => ({
          startDate: new Date(r.startDate),
          endDate: new Date(r.endDate)
        }));
    })(),

    // Arrays
    productVariantsIds: promotionData?.promotionProductsDTOs?.map(p => p.productVariantId) ?? [],
    // For buy-X-get-Y style promotions try to extract productIdX and productIdY from known DTOs
    productIdX: (() => {
      // If there is a specific field, use it
      if ((promotionData as any)?.productIdX) return (promotionData as any).productIdX;
      // Try to infer from productRequirementsDTOs (first requirement)
      const req = (promotionData as any)?.productRequirementsDTOs ?? [];
      if (Array.isArray(req) && req.length > 0) return req[0].productVariantId ?? 0;
      return 0;
    })(),
    productIdY: (() => {
      if ((promotionData as any)?.productIdY) return (promotionData as any).productIdY;
      // Try to infer from productRewardsDTOs (first reward)
      const rew = (promotionData as any)?.productRewardsDTOs ?? [];
      if (Array.isArray(rew) && rew.length > 0) return rew[0].productVariantId ?? 0;
      return 0;
    })(),
    categoriesIds: promotionData?.promotionCategoriesDTOs?.map(c => c.categoryId) ?? [],

    // Límites de uso
    usageLimit: promotionData?.usageLimit ?? 0,
    usageLimitPerUser: promotionData?.usageLimitPerUser ?? 0,

    // Estado
    isActive: promotionData?.isActive ?? true,

    // Requisitos de compra
    minimumAmount: promotionData?.minPurchaseAmount ?? 0,
    minimumItems: promotionData?.minProductQuantity ?? 0,
  };
}
