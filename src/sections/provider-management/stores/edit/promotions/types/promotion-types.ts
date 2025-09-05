

// Tipos de promociones disponibles (basados en la imagen del modal)
export enum PromotionType {
  CODE = 'code',
  ORDER_VALUE = 'order_value', 
  AUTOMATIC = 'automatic',
  PACKAGE = 'package',
  BUY_X_GET_Y = 'buy_x_get_y',
  FREE_DELIVERY = 'free-delivery'
}

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
  TRUCK: "🚚"
};

// Configuración exacta basada en la imagen del modal
export const PROMOTION_TYPES: PromotionTypeConfig[] = [
  {
    id: PromotionType.CODE,
    name: "Código de descuento",
    description: "Crear un código de descuento y compartirlo con los clientes",
    icon: PromotionIcons.TAG,
    color: "bg-yellow-100 text-yellow-800",
    value: "code"
  },
  {
    id: PromotionType.ORDER_VALUE,
    name: "Descuento por valor del pedido",
    description: "Aplicar un descuento cuando el total de artículos excede un valor especificado",
    icon: PromotionIcons.CART,
    color: "bg-blue-100 text-blue-800", 
    value: "order-value"
  },
  {
    id: PromotionType.AUTOMATIC,
    name: "Descuento automático",
    description: "Aplicar un descuento a todos los productos",
    icon: PromotionIcons.MAGIC,
    color: "bg-purple-100 text-purple-800",
    value: "automatic"
  },
  {
    id: PromotionType.PACKAGE,
    name: "Descuento por paquete",
    description: "Ofrecer un descuento por la compra de múltiples artículos",
    icon: PromotionIcons.PACKAGE,
    color: "bg-green-100 text-green-800",
    value: "package"
  },
  {
    id: PromotionType.BUY_X_GET_Y,
    name: "Compre X obtenga Y",
    description: "Ofrecer artículos gratis cuando los clientes compren artículos específicos",
    icon: PromotionIcons.GIFT,
    color: "bg-orange-100 text-orange-800",
    value: "buy-x-get-y"
  },
  {
    id: PromotionType.FREE_DELIVERY,
    name: "Entrega gratuita",
    description: "Establecer condiciones para envío y entrega gratuitos",
    icon: PromotionIcons.TRUCK,
    color: "bg-teal-100 text-teal-800",
    value: "free-delivery"
  }
];
