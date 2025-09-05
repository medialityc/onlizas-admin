/**
 * Utilidades compartidas para el manejo de promociones
 */

// Re-export de las funciones centralizadas desde promotion-types
export { mapBackendPromotionType, getPromotionTypeName } from '../types/promotion-types';

// Helper function para navegación después de guardar
export const navigateAfterSave = (router: any) => {
  if (typeof window !== "undefined") {
    const savedPath = localStorage.getItem('promotionFormBackPath');
    if (savedPath) {
      try {
        const url = new URL(savedPath, window.location.origin);
        url.searchParams.set('tab', 'promotions');
        localStorage.removeItem('promotionFormBackPath');
        router.push(url.pathname + url.search);
        return;
      } catch (error) {
        console.warn('Error parsing saved path:', error);
        localStorage.removeItem('promotionFormBackPath');
      }
    }
  }
  // Fallback: usar router.back()
  router.back();
};

// Obtener texto del descuento formateado
export const getDiscountText = (type: number, value: number) => {
  switch (type) {
    case 0: return `${value}%`;
    case 1: return `$${value}`;
    case 2: return 'Gratis';
    case 3: return 'Envío gratis';
    default: return `$${value}`;
  }
};
