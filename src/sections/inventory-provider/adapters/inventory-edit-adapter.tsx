import { detailsObjectToArray } from "@/utils/format";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";

export const getInventoryEditAdapter = (
  inventory: InventoryStoreFormData
): any => {
  return {
    ...inventory,
    products: inventory?.products?.map((prod) => ({
      ...prod,
      details: detailsObjectToArray(prod?.details),

      purchaseLimit: prod?.limitPurchaseLimit,
      isLimit:
        prod?.limitPurchaseLimit && prod?.limitPurchaseLimit > 0 ? true : false,
    })),
  };
};
