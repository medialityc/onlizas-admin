import { z } from "zod";

export const meWarehouseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre del almacén es requerido"),
  active: z.boolean().default(true),
  rules: z.any().optional(),
  address: z.object({
    name: z.string().min(1, "Requerido"),
    mainStreet: z.string().min(1, "Requerido"),
    difficultAccessArea: z.boolean().default(false),
    number: z.string().optional(),
    otherStreets: z.string().optional(),
    city: z.string().min(1, "Requerido"),
    zipcode: z.string().optional(),
    annotations: z.string().optional(),
    districtId: z.string().optional(),
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
