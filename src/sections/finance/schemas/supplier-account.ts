import { z } from "zod";

export const SupplierAccountSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  accountNumber: z.string().min(1, "Número de cuenta requerido"),
  bank: z.string().min(1, "Banco requerido"),
  isPrimaryAccount: z.boolean(),
});

export type SupplierAccountInput = z.infer<typeof SupplierAccountSchema>;
