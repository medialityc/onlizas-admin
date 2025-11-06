import { z } from "zod";

export const meWarehouseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre del almacén es requerido"),
  active: z.boolean().default(true),
  rules: z.any().optional(),
  locationId: z.string({ required_error: "Requerido" }),
});

export type MeWarehouseFormData = z.infer<typeof meWarehouseSchema> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  locationName?: string;
  supplierName?: string;
};
