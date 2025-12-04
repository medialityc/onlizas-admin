import { z } from "zod";

export const GeneratePartialClosureSchema = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  suppliers: z.array(
    z.object({
      userId: z.string().min(1, "ID de usuario requerido"),
      userName: z.string().min(1, "Nombre de usuario requerido"),
      email: z.string().email("Email inválido"),
      accounts: z.array(
        z.object({
          accountId: z.string().min(1, "ID de cuenta requerido"),
          description: z.string().min(1, "Descripción requerida"),
          totalAmount: z
            .number()
            .nonnegative("Monto total no puede ser negativo"),
          createdDate: z.string().min(1, "Fecha de creación requerida"),
          dueDate: z.string().min(1, "Fecha de vencimiento requerida"),
          subOrdersCount: z
            .number()
            .nonnegative("Cantidad de subórdenes no puede ser negativa"),
          orderIds: z.array(z.string().min(1, "ID de orden requerido")),
        })
      ),
      totalPendingAccounts: z
        .number()
        .nonnegative("Cantidad de cuentas pendientes no puede ser negativa"),
      totalPendingAmount: z
        .number()
        .nonnegative("Monto pendiente total no puede ser negativo"),
      oldestDueDate: z
        .string()
        .min(1, "Fecha de vencimiento más antigua requerida"),
      newestDueDate: z
        .string()
        .min(1, "Fecha de vencimiento más reciente requerida"),
    })
  ),
  notes: z.string().optional(),
});

export type GeneratePartialClosureInput = z.infer<
  typeof GeneratePartialClosureSchema
>;

export const RetryPaymentSchema = z.object({
  accountId: z.string().min(1),
});

export type RetryPaymentInput = z.infer<typeof RetryPaymentSchema>;
