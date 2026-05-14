import { z } from "zod";

export const PlatformPurposeEnum = z.enum(["1", "2", "3", "4"]);

export const PlatformAccountCreateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  accountNumber: z.string().min(1, "Número de cuenta requerido"),
  purpose: PlatformPurposeEnum, // will be sent as number
  bank: z.string().min(1, "Banco requerido"),
  isMainAccount: z.boolean(),
  description: z.string().optional(),
  accountHolderName: z.string().max(100).nullable().optional(),
  documentType: z.preprocess(
    (val) => (val === "" ? null : val),
    z.enum(["NIT", "CC", "CE", "Pasaporte", "Otro"]).nullable().optional()
  ),
  documentNumber: z.string().max(50).nullable().optional(),
  city: z.string().max(60).nullable().optional(),
  country: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().length(2).nullable().optional()
  ),
  swiftCode: z.string().max(11).nullable().optional(),
});

export type PlatformAccountCreateInput = z.infer<
  typeof PlatformAccountCreateSchema
>;
