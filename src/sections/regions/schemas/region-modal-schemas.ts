import { z } from "zod";

// Schema para Payment Gateway que coincide exactamente con el backend
export const paymentGatewaySchema = z.object({
    paymentGatewayId: z.number(),
    priority: z.number().min(1, "La prioridad debe ser mayor a 0").max(100, "La prioridad debe ser menor a 100"),
    isFallback: z.boolean(),
    isEnabled: z.boolean(),
    supportedMethods: z.array(z.string()).min(1, "Debe seleccionar al menos un método de pago"),
    configurationJson: z.string().optional()
});

// Schema para Shipping Method que coincide exactamente con el backend
export const shippingMethodSchema = z.object({
    shippingMethodId: z.number(),
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

// Schema para Tax Configuration (para futuro uso)
export const taxConfigurationSchema = z.object({
    taxId: z.number(),
    isEnabled: z.boolean(),
    rate: z.number().min(0, "La tasa debe ser mayor o igual a 0").max(100, "La tasa debe ser menor o igual a 100"),
    isTaxIncluded: z.boolean(),
    exemptionThreshold: z.number().optional().nullable(),
    description: z.string().optional()
});

// Schema para Currency que coincide exactamente con el backend
export const currencySchema = z.object({
    currencyId: z.number(),
    isEnabled: z.boolean(),
    rate: z.number().min(0.001, "La tasa debe ser mayor a 0"),
    isPrimary: z.boolean()
});

// Tipos derivados de los schemas
export type PaymentGatewayFormData = z.infer<typeof paymentGatewaySchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
export type TaxConfigurationFormData = z.infer<typeof taxConfigurationSchema>;
export type CurrencyFormData = z.infer<typeof currencySchema>;

// Interfaces para los datos recibidos del backend
export interface PaymentGateway {
    paymentGatewayId: number;
    name: string;
    code: string;
    priority: number;
    isEnabled: boolean;
    isFallback: boolean;
    supportedMethods: string[];
    configurationJson?: string;
}

export interface ShippingMethod {
    shippingMethodId: number;
    name: string;
    code: string;
    carrier: string;
    baseCost: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    isEnabled: boolean;
    maxWeight?: number;
    maxDimensions?: number;
}

export interface TaxConfiguration {
    taxId: number;
    name: string;
    code: string;
    rate: number;
    isEnabled: boolean;
    isTaxIncluded: boolean;
    exemptionThreshold?: number;
    description?: string;
}

export interface Currency {
    currencyId: number;
    name: string;
    code: string;
    symbol: string;
    rate: number;
    isEnabled: boolean;
    isPrimary: boolean;
}

// Constantes útiles
export const AVAILABLE_PAYMENT_METHODS = [
    { value: "card", label: "Tarjeta de Crédito/Débito" },
    { value: "bank_transfer", label: "Transferencia Bancaria" },
    { value: "cash", label: "Efectivo" },
    { value: "wallet", label: "Billetera Digital" },
    { value: "crypto", label: "Criptomonedas" },
    { value: "bnpl", label: "Compra Ahora, Paga Después" }
];