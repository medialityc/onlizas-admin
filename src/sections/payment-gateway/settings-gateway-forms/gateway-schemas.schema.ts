import { z } from "zod";

export const stripeSchema = z.object({
  "stripe-publishable": z.string().min(1, "Publishable Key is required"),
  "stripe-secret": z.string().min(1, "Secret Key is required"),
  "stripe-webhook": z.string().min(1, "Webhook Secret is required"),
  "stripe-live": z.boolean().optional(),
});

export const paypalSchema = z.object({
  "paypal-client-id": z.string().min(1, "Client ID is required"),
  "paypal-client-secret": z.string().min(1, "Client Secret is required"),
  "paypal-mode": z.enum(["sandbox", "live"]).default("sandbox"),
});

export const tropipaySchema = z.object({
  "tropipay-client-id": z.string().min(1, "Client ID is required"),
  "tropipay-client-secret": z.string().min(1, "Client Secret is required"),
  "tropipay-merchant-token": z.string().min(1, "Merchant Token is required"),
  "tropipay-endpoint": z
    .string()
    .url("Must be a valid URL")
    .default("https://api.tropipay.com"),
});

export const squareSchema = z.object({
  "square-access-token": z.string().min(1, "Access Token is required"),
  "square-location-id": z.string().min(1, "Location ID is required"),
  "square-sandbox": z.boolean().optional(),
});

export const authorizeSchema = z.object({
  "authnet-login-id": z.string().min(1, "API Login ID is required"),
  "authnet-transaction-key": z.string().min(1, "Transaction Key is required"),
  "authnet-sandbox": z.boolean().optional(),
});

export const bankSchema = z.object({
  "bank-name": z.string().min(1, "Bank Name is required"),
  "account-number": z.string().min(1, "Account Number is required"),
  "routing-number": z.string().min(1, "Routing Number / SWIFT is required"),
  beneficiary: z.string().min(1, "Beneficiary Name is required"),
  instructions: z.string().optional(),
});

export const gatewaysSchemas = {
  stripe: stripeSchema,
  paypal: paypalSchema,
  tropipay: tropipaySchema,
  square: squareSchema,
  authorize: authorizeSchema,
  bank: bankSchema,
};

export type StripeConfig = z.infer<typeof stripeSchema>;
export type PaypalConfig = z.infer<typeof paypalSchema>;
export type TropipayConfig = z.infer<typeof tropipaySchema>;
export type SquareConfig = z.infer<typeof squareSchema>;
export type AuthorizeConfig = z.infer<typeof authorizeSchema>;
export type BankConfig = z.infer<typeof bankSchema>;

export const gatewaySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stripe"), config: stripeSchema }),
  z.object({ type: z.literal("paypal"), config: paypalSchema }),
  z.object({ type: z.literal("tropipay"), config: tropipaySchema }),
  z.object({ type: z.literal("square"), config: squareSchema }),
  z.object({ type: z.literal("authorize"), config: authorizeSchema }),
  z.object({ type: z.literal("bank"), config: bankSchema }),
]);

export type GatewayInput = z.infer<typeof gatewaySchema>;
