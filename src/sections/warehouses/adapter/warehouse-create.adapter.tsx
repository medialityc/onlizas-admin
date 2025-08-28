import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";
import { WarehouseFormData } from "../schemas/warehouse-schema";

export const getCreateWarehouseAdapter = (warehouse: WarehouseFormData) => {
  return {
    ...warehouse,
    ...(warehouse?.type === WAREHOUSE_TYPE_ENUM.physical
      ? { isPhysical: true }
      : { isPhysical: false }),
    ...(warehouse?.type === WAREHOUSE_TYPE_ENUM.physical
      ? { maxCapacity: warehouse?.capacity }
      : {}),
  };
};
