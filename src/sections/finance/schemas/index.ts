import { z } from "zod";

export const GeneratePartialClosureSchema = z.object({
  fromDate: z.string().min(1, "Fecha inicio requerida"),
  toDate: z.string().min(1, "Fecha fin requerida"),
  suppliers: z.array(z.string()).min(1, "Seleccione al menos un proveedor"),
  amountBySupplier: z.record(z.string(), z.number().nonnegative()),
});

export type GeneratePartialClosureInput = z.infer<
  typeof GeneratePartialClosureSchema
>;

export const RetryPaymentSchema = z.object({
  accountId: z.string().min(1),
});

export type RetryPaymentInput = z.infer<typeof RetryPaymentSchema>;
