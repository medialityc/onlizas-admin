import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.virtual,
  isActive: false,
  locationId: 0,
  capacity: 0,
  capacityUnit: "KG",
  rules: "rules",
  supplierId: undefined,
  virtualTypeId: 1,
};
