import { z } from "zod";

export const warehouseVirtualTypeSchema = z.object({
  name: z.string().min(1, "El nombre del almacén es requerido"),
  active: z.boolean().default(true),
  defaultRules: z.any().optional(),
});

export type WarehouseVirtualTypeFormData = z.infer<typeof warehouseVirtualTypeSchema> & {
  id?: string;
};
