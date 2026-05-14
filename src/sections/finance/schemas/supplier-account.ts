import { z } from "zod";

export const SupplierAccountSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  accountNumber: z.string().min(1, "Número de cuenta requerido"),
  bank: z.string().min(1, "Banco requerido"),
  isPrimaryAccount: z.boolean(),
  accountHolderName: z.string().max(100).nullable().optional(),
  documentType: z
    .enum(["NIT", "CC", "CE", "Pasaporte", "Otro"])
    .nullable()
    .optional(),
  documentNumber: z.string().max(50).nullable().optional(),
  city: z.string().max(60).nullable().optional(),
  country: z.string().length(2).nullable().optional(),
  swiftCode: z.string().max(11).nullable().optional(),
});

export type SupplierAccountInput = z.infer<typeof SupplierAccountSchema>;
