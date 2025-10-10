import type { Promotion } from "@/types/promotions";

export const mockPromotions: Promotion[] = [
  { 
    id: 1, 
    name: "Descuento de Año Nuevo", 
    description: "20% de descuento en toda la tienda", 
    discountType: 0, // percent
    discountValue: 20, 
    code: "NUEVO2024", 
    usageLimit: 100,
    usedCount: 25, 
    startDate: "2024-01-01", 
    endDate: "2024-01-31", 
    active: true,
    storeId: 1,
    storeName: "Tienda Principal",
    mediaFile: "",
    promotionCategoriesDTOs: [],
    promotionProductsDTOs: []
  },
  { 
    id: 2, 
    name: "Envío Gratis", 
    description: "Envío gratuito en compras mayores a $50", 
    discountType: 1, // amount
    discountValue: 50, 
    code: "",
    usageLimit: 0,
    usedCount: 25, 
    startDate: "2024-01-01", 
    endDate: "2024-12-31", 
    active: true,
    storeId: 1,
    storeName: "Tienda Principal",
    mediaFile: "",
    promotionCategoriesDTOs: [],
    promotionProductsDTOs: []
  },
];
