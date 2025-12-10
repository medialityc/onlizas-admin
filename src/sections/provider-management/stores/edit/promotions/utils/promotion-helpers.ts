/**
 * Utilidades compartidas para el manejo de promociones
 */

export {
  getPromotionTypeName,
} from "../types/promotion-types";

// Helper function para navegación después de guardar
export const navigateAfterSave = (router: any) => {
  if (typeof window !== "undefined") {
    const savedPath = localStorage.getItem("promotionFormBackPath");
    if (savedPath) {
      try {
        const url = new URL(savedPath, window.location.origin);
        url.searchParams.set("tab", "promotions");
        localStorage.removeItem("promotionFormBackPath");
        router.push(url.pathname + url.search);
        return;
      } catch (error) {
        console.warn("Error parsing saved path:", error);
        localStorage.removeItem("promotionFormBackPath");
      }
    }
  }
  // Fallback: usar router.back()
  router.back();
};

// Obtener texto del descuento formateado
export const getDiscountText = (discountType: number, value: number) => {
  switch (discountType) {
    case 1:
      return `${value}%`; // Porcentaje
    case 2:
      return `$${value}`; // MontoFijo
    case 3:
      return "Envío gratis"; // EnvíoGratis
    case 4:
      return "Compra X lleva Y"; // CompraXLlevaY
    default:
      return `$${value}`;
  }
};
