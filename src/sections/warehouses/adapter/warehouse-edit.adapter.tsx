import { WarehouseFormData } from "../schemas/warehouse-schema";

export const getAdapterWarehouse = (warehouse: WarehouseFormData) => {
  if (!warehouse) {
    return undefined;
  }
  return {
    ...warehouse,
    type: warehouse?.type,
  };
};
