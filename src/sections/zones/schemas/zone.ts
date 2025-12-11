import { z } from "zod";

export const ZoneSchema = z.object({
  name: z.string({ error: "Nombre requerido" }).min(1, "Nombre requerido"),
  deliveryAmount: z
    .number({ error: "Costo de entrega requerido" })
    .min(0, "El costo debe ser 0 o mayor"),
  districtsIds: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un distrito"),
});

export type ZoneInput = z.infer<typeof ZoneSchema>;
