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

// Mapeo ÚNICO del backend numérico (0-5) a nuestros tipos
export const BACKEND_TYPE_MAP: { [key: number]: PromotionType } = {
  0: PromotionType.CODE,
  1: PromotionType.ORDER_VALUE,
  2: PromotionType.AUTOMATIC,
  3: PromotionType.PACKAGE,
  4: PromotionType.BUY_X_GET_Y,
  5: PromotionType.FREE_DELIVERY,
};

// Función ÚNICA para convertir tipos del backend
export const mapBackendPromotionType = (
  backendType: number | string
): string => {
  if (typeof backendType === "number") {
    return BACKEND_TYPE_MAP[backendType] || PromotionType.CODE;
  }

  // Si viene como string, intentar parsear como número primero
  const numType = parseInt(String(backendType));
  if (!isNaN(numType) && BACKEND_TYPE_MAP[numType]) {
    return BACKEND_TYPE_MAP[numType];
  }

  // Fallback: devolver el string tal como viene (ya debería estar correcto)
  return String(backendType);
};

// Función ÚNICA para obtener nombres legibles
export const getPromotionTypeName = (
  promotionType?: number | string
): string => {
  if (promotionType === undefined || promotionType === null) {
    return "No especificado";
  }

  const mappedType = mapBackendPromotionType(promotionType);
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
