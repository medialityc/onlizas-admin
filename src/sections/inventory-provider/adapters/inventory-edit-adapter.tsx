import { detailsObjectToArray } from "@/utils/format";
import { InventoryProvider } from "@/types/inventory";

export const getInventoryEditAdapter = (inventory: InventoryProvider): any => {
  return {
    ...inventory,
    products: inventory?.products?.map((prod) => ({
      ...prod,
      isPacking: inventory.isPacking,
      details: detailsObjectToArray(prod?.details) as any,
      warranty: prod.warranty
        ? prod.warranty
        : {
            isWarranty: false,
            warrantyTime: 0,
            warrantyPrice: 0,
          },
      purchaseLimit: prod?.limitPurchaseLimit,
      packageDelivery: false,
      isActive: prod?.isActive,
      isLimit:
        prod?.limitPurchaseLimit && prod?.limitPurchaseLimit > 0 ? true : false,
    })),
  };
};
