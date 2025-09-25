import { detailsObjectToArray } from "@/utils/format";
import { InventoryProvider } from "@/types/inventory";

export const getInventoryEditAdapter = (inventory: InventoryProvider): any => {
  return {
    ...inventory,
    products: inventory?.products?.map((prod) => ({
      ...prod,
      isPacking: inventory.isPacking,
      details: detailsObjectToArray(prod?.details) as any,
      warranty: prod.warranty ? prod.warranty : undefined,
      purchaseLimit: prod?.limitPurchaseLimit,
      packageDelivery: false,
      isLimit:
        prod?.limitPurchaseLimit && prod?.limitPurchaseLimit > 0 ? true : false,
    })),
  };
};
