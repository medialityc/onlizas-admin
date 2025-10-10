import { z } from "zod";

// Tipos base para las entidades de region (se usan en las modales de edición)
export type Currency = {
  id: string | number;
  name: string;
  code: string;
  symbol: string;
  isEnabled: boolean;
  rate: number;
  isPrimary: boolean;
};

export type PaymentGateway = {
  paymentGatewayId: string | number;
  name: string;
  code: string;
  priority: number;
  isFallback: boolean;
  isEnabled: boolean;
  supportedMethods: string[];
  configurationJson?: string;
};

export type ShippingMethod = {
  shippingMethodId: string | number;
  name: string;
  code: string;
  isEnabled: boolean;
  baseCost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  maxWeight?: number | null;
  maxDimensions?: number | null;
  carrier: string;
};

// Schemas para validación de formularios
// Schema para Payment Gateway que coincide exactamente con el backend
export const paymentGatewaySchema = z.object({
    paymentGatewayId: z.union([z.number(),z.string()]),
    priority: z.number().min(1, "La prioridad debe ser mayor a 0").max(100, "La prioridad debe ser menor a 100"),
    isFallback: z.boolean(),
    isEnabled: z.boolean(),
    supportedMethods: z.array(z.string()).min(1, "Debe seleccionar al menos un método de pago"),
    configurationJson: z.string().optional()
});

// Schema para Shipping Method que coincide exactamente con el backend
export const shippingMethodSchema = z.object({
    shippingMethodId: z.union([z.string(),z.number()]) ,
    baseCost: z.number().min(0, "El costo base debe ser mayor o igual a 0"),
    estimatedDaysMin: z.number().min(1, "Los días mínimos deben ser mayor a 0"),
    estimatedDaysMax: z.number().min(1, "Los días máximos deben ser mayor a 0"),
    maxWeight: z.number().optional().nullable(),
    maxDimensions: z.number().optional().nullable(),
    carrier: z.string().min(1, "El transportista es requerido"),
    enabled: z.boolean() // El backend espera 'enabled', no 'isEnabled'
}).refine((data) => data.estimatedDaysMax >= data.estimatedDaysMin, {
    message: "Los días máximos deben ser mayor o igual a los días mínimos",
    path: ["estimatedDaysMax"]
});

// Schema para Currency que coincide exactamente con el backend
export const currencySchema = z.object({
    currencyId: z.union([z.number(),z.string()]),
    isEnabled: z.boolean(),
    rate: z.number().min(0.001, "La tasa debe ser mayor a 0"),
    isPrimary: z.boolean()
});

// Tipos derivados de los schemas
export type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
export type CurrencyFormData = z.infer<typeof currencySchema>;

// Constantes útiles
export const AVAILABLE_PAYMENT_METHODS = [
    { value: "card", label: "Tarjeta de Crédito/Débito" },
    { value: "bank_transfer", label: "Transferencia Bancaria" },
    { value: "cash", label: "Efectivo" },
    { value: "wallet", label: "Billetera Digital" },
    { value: "crypto", label: "Criptomonedas" },
    { value: "bnpl", label: "Compra Ahora, Paga Después" }
];