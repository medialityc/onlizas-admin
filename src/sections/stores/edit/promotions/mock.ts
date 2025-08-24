import type { Promotion } from "@/types/stores";

export const mockPromotions: Promotion[] = [
  { id: 1, name: "Descuento de Año Nuevo", description: "20% de descuento en toda la tienda", type: "percent", value: 20, code: "NUEVO2024", usedCount: 25, startDate: "2024-01-01", endDate: "2024-01-31", isActive: true },
  { id: 2, name: "Envío Gratis", description: "Envío gratuito en compras mayores a $50", type: "amount", value: 50, usedCount: 25, startDate: "2024-01-01", endDate: "2024-12-31", isActive: true, badge: "Envío Gratis" },
];
