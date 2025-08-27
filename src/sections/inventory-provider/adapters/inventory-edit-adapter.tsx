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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      purchaseLimit: prod?.limitPurchaseLimit,
    })),
  };
};
