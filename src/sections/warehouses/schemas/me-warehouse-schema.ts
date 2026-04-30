import { z } from "zod";

export const meWarehouseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre del almacén es requerido"),
  active: z.boolean().default(true),
  rules: z.any().optional(),
  address: z.object({
    name: z.string().optional(),
    mainStreet: z.string().optional(),
    difficultAccessArea: z.boolean().default(false),
    number: z.string().optional(),
    otherStreets: z.string().optional(),
    city: z.string().optional(),
    zipcode: z.union([
      z.literal(""),
      z.string().regex(/^\d{5}$/, "El código postal debe tener exactamente 5 dígitos"),
    ]).optional(),
    annotations: z.string().optional(),
      districtId: z.string().optional(),
      stateId: z.string().optional(),
      countryId: z.string().optional(),
    }),
});

export type MeWarehouseFormData = z.infer<typeof meWarehouseSchema> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  addressName?: string;
  supplierId?: string;
};
