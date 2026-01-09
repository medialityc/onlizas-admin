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

export const gatewaysSchemas = {
  stripe: stripeSchema,
  paypal: paypalSchema,
};

export type StripeConfig = z.infer<typeof stripeSchema>;
export type PaypalConfig = z.infer<typeof paypalSchema>;

export const gatewaySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stripe"), config: stripeSchema }),
  z.object({ type: z.literal("paypal"), config: paypalSchema }),
]);

export type GatewayInput = z.infer<typeof gatewaySchema>;
