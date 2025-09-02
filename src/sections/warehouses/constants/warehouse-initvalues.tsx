import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.virtual,
  isActive: false,
  locationId: 0,
  capacity: 0,
  capacityUnit: "KG",
  rules: "",
  supplierId: undefined,
  virtualTypeId: 1,
};
export const initValueMeWarehouse: MeWarehouseFormData = {
  name: "",
  isActive: false,
  locationId: 0,
  rules: "",
  virtualTypeId: 0,
};
