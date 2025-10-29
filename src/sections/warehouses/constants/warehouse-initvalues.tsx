import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.virtualwarehouse,
  active: false,
  locationId: "",
  capacity: 0,
  capacityUnit: "KG",
  supplierId: undefined,
};
export const initValueMeWarehouse: MeWarehouseFormData = {
  name: "",
  active: false,
  locationId: 0,
  rules: "",
  virtualTypeId: 0,
};
