import { z } from "zod";

export const warehouseTransferSchema = z
  .object({
    originId: z.string({
      required_error: "Almacén de origen es requerido",
    }),
    destinationId: z
      .string({ required_error: "Almacén de destino es requerido" })
      .refine((val) => !!val, {
        message: "Almacén de destino es requerido",
      }),
    transferNumber: z.coerce
      .string({ required_error: "Número de transferencia es requerido" })
      .default("string"),
    items: z
      .array(
        z.object({
          productVariantId: z.string({
            required_error: "Producto es requerido",
          }),
          quantityRequested: z.coerce.number({
            required_error: "Cantidad es requerida",
          }),
          unit: z.string({ required_error: "Unidad es requerida" }),
        })
      )
      .min(1, "Debe seleccionar al menos un producto a transferir"),
  })
  .refine((data) => data.originId !== data.destinationId, {
    message: "El almacén de origen y destino no pueden ser el mismo",
    path: ["destinationId"],
  });

export type WarehouseTransferFormData = z.infer<typeof warehouseTransferSchema>;
