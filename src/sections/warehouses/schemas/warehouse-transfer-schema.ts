import { z } from "zod";

/* {
  "originWarehouseId": 0,
  "destinationWarehouseId": 0,
  "transferNumber": "string",
  "items": [
    {
      "productVariantId": 1,
      "quantityRequested": 1,
      "unit": "string"
    }
  ]
} */

export const warehouseVirtualTransferSchema = z.object({
  originWarehouseId: z.number({ required_error: "Requerido" }),
  destinationWarehouseId: z.number({ required_error: "Requerido" }),
  transferNumber: z.coerce.number({ required_error: "Requerido" }),
  items: z
    .array(
      z.object({
        productVariantId: z.number({ required_error: "Requerido" }),
        quantityRequested: z.coerce.number({ required_error: "Requerido" }),
        unit: z.string(),
      })
    )
    .min(1, "Debe seleccionar al menos un producto a transferir"),
});

export type WarehouseTransferFormData = z.infer<
  typeof warehouseVirtualTransferSchema
>;
