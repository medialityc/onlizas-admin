// Tipos de promociones disponibles (basados en la imagen del modal)
export enum PromotionType {
  CODE = "code",
  ORDER_VALUE = "order-value", // Unificado con guión
  AUTOMATIC = "automatic",
  PACKAGE = "package",
  BUY_X_GET_Y = "buy-x-get-y", // Unificado con guión
  FREE_DELIVERY = "free-delivery",
  INVENTORY = "inventory", // Nuevo tipo
}

// Mapeo unificado del backend a nuestros tipos
export const BACKEND_TYPE_MAP: { [key: number]: PromotionType } = {
  // targetType: 1=ProductVariant, 2=Inventory (principales)
  1: PromotionType.PACKAGE, // ProductVariant -> package
  2: PromotionType.INVENTORY, // Inventory -> inventory

  // promotionType: 0-5 (otras opciones disponibles)
  0: PromotionType.CODE,
  3: PromotionType.ORDER_VALUE,
  4: PromotionType.AUTOMATIC,
  5: PromotionType.BUY_X_GET_Y,
  6: PromotionType.FREE_DELIVERY,
};

// Función para obtener nombres legibles basada en targetType
export const getPromotionTypeName = (targetType?: number): string => {
  if (!targetType) {
    return "No especificado";
  }

  const mappedType = BACKEND_TYPE_MAP[targetType];
  const config = PROMOTION_TYPES.find((t) => t.value === mappedType);
  return config?.name || "Tipo desconocido";
};

// Configuración de cada tipo de promoción
export interface PromotionTypeConfig {
  id: PromotionType;
  name: string;
  description: string;
  icon: string; // Emoji como en la imagen
  color: string;
  value: string; // Valor para identificar el tipo en la URL
}

// Iconos de emojis que corresponden a la imagen
const PromotionIcons = {
  TAG: "🏷️",
  CART: "🛒",
  MAGIC: "✨",
  PACKAGE: "📦",
  GIFT: "🎁",
  TRUCK: "🚚",
};

export const PROMOTION_TYPES: PromotionTypeConfig[] = [
  {
    id: PromotionType.INVENTORY,
    name: "Promoción por Inventario",
    description: "Aplicar descuentos a items específicos de inventario",
    icon: "🏪",
    color: "bg-indigo-100 text-indigo-800",
    value: "inventory",
  },
  {
    id: PromotionType.CODE,
    name: "Código de descuento",
    description: "Crear un código de descuento y compartirlo con los clientes",
    icon: PromotionIcons.TAG,
    color: "bg-yellow-100 text-yellow-800",
    value: "code",
  },
  {
    id: PromotionType.ORDER_VALUE,
    name: "Descuento por valor del pedido",
    description:
      "Aplicar un descuento cuando el total de artículos excede un valor especificado",
    icon: PromotionIcons.CART,
    color: "bg-blue-100 text-blue-800",
    value: "order-value",
  },
  {
    id: PromotionType.AUTOMATIC,
    name: "Descuento automático",
    description: "Aplicar un descuento a todos los productos",
    icon: PromotionIcons.MAGIC,
    color: "bg-purple-100 text-purple-800",
    value: "automatic",
  },
  {
    id: PromotionType.PACKAGE,
    name: "Descuento por paquete",
    description: "Ofrecer un descuento por la compra de múltiples artículos",
    icon: PromotionIcons.PACKAGE,
    color: "bg-green-100 text-green-800",
    value: "package",
  },
  {
    id: PromotionType.BUY_X_GET_Y,
    name: "Compre X obtenga Y",
    description:
      "Ofrecer artículos gratis cuando los clientes compren artículos específicos",
    icon: PromotionIcons.GIFT,
    color: "bg-orange-100 text-orange-800",
    value: "buy-x-get-y",
  },
  {
    id: PromotionType.FREE_DELIVERY,
    name: "Entrega gratuita",
    description: "Establecer condiciones para envío y entrega gratuitos",
    icon: PromotionIcons.TRUCK,
    color: "bg-teal-100 text-teal-800",
    value: "free-delivery",
  },
];
