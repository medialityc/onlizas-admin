import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const warehouseAdapter = (
  payload: WarehouseFormData
): Partial<WarehouseFormData> => {
  if (payload.type === WAREHOUSE_TYPE_ENUM.warehouse) {
    return {
      type: payload.type,
      id: payload.id,
      name: payload.name,
      capacity: payload.capacity,
      capacityUnit: payload.capacityUnit,
      address: payload.address,
    };
  }

  return {
    type: payload.type,
    id: payload.id,
    name: payload.name,
    supplierId: payload.supplierId,
    address: payload.address,
  };
};
