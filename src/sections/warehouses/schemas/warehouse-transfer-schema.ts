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

export const warehouseTransferSchema = z.object({
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

  inventories: z
    .array(
      z.object({
        parentProductName: z.string({ required_error: "Requerido" }),
        supplierName: z.string({ required_error: "Requerido" }),
        totalQuantity: z.coerce.number({ required_error: "Requerido" }),
        price: z.coerce.number({ required_error: "Requerido" }),
        products: z.array(
          z.object({
            productName: z.string({ required_error: "Requerido" }),
            details: z.array(z.object({ key: z.string(), value: z.string() })),
            quantity: z.coerce
              .number({ required_error: "Requerido" })
              .positive("Es un número positivo"),
            images: z.array(z.string()).optional(),
          })
        ),
      })
    )
    .min(1, "Debe seleccionar al menos un inventario"),
});

export type WarehouseTransferFormData = z.infer<
  typeof warehouseTransferSchema
>;
