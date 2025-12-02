import { z } from "zod";

export const PlatformPurposeEnum = z.enum(["1", "2", "3", "4"]);

export const PlatformAccountCreateSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  accountNumber: z.string().min(1, "Número de cuenta requerido"),
  purpose: PlatformPurposeEnum, // will be sent as number
  bank: z.string().min(1, "Banco requerido"),
  isMainAccount: z.boolean(),
  description: z.string().optional(),
});

export type PlatformAccountCreateInput = z.infer<
  typeof PlatformAccountCreateSchema
>;
