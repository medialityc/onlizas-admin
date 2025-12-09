import { detailsObjectToArray } from "@/utils/format";
import { InventoryProvider } from "@/types/inventory";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";

export const getInventoryEditAdapter = (inventory: InventoryProvider): InventoryStoreFormData => {
  return {
    ...inventory,
    id: String(inventory.id),
    storeId: String(inventory.storeId),
    supplierId: String(inventory.supplierId),
    products: inventory?.products?.map((prod) => {
      // Determinar deliveryMode con valor por defecto garantizado
      let deliveryMode: "ONLIZAS" | "PROVEEDOR" = "ONLIZAS";
      if (prod.deliveryMode) {
        deliveryMode = prod.deliveryMode as "ONLIZAS" | "PROVEEDOR";
      } else if ((prod as any).deliveryType === 1) {
        deliveryMode = "PROVEEDOR";
      }
      
      return {
        id: prod.id || "",
        sku: prod.sku || "",
        upc: prod.upc || "",
        ean: prod.ean || "",
        condition: prod.condition || 0,
        stock: prod.stock || 0,
        price: prod.price || 0,
        costPrice: (prod as any).costPrice || 0,
        volume: (prod as any).volume || 0,
        weight: (prod as any).weight || 0,
        isPacking: inventory.isPacking,
        details: detailsObjectToArray(prod?.details) as any,
        warranty: prod.warranty
          ? prod.warranty
          : {
              isWarranty: false,
              warrantyTime: 0,
              warrantyPrice: 0,
            },
        purchaseLimit: prod?.limitPurchaseLimit || 0,
        packageDelivery: false,
        isActive: prod?.isActive ?? true,
        isPrime: prod?.isPrime ?? false,
        isLimit:
          prod?.limitPurchaseLimit && prod?.limitPurchaseLimit > 0 ? true : false,
        images: prod.images || [],
        deliveryMode: deliveryMode,
        zones: prod.zones || [],
        zoneIds: prod.zones?.map((z) => z.id) || [],
      };
    }),
  } as InventoryStoreFormData;
};
