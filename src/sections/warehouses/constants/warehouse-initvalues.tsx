import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ROUTE_ENUM } from "./warehouse-type";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ROUTE_ENUM.virtual,
  active: false,
  locationId: "",
  capacity: 0,
  capacityUnit: "KG",
  rules: "",
  supplierId: undefined,
  virtualTypeId: null,
};
export const initValueMeWarehouse: MeWarehouseFormData = {
  name: "",
  active: false,
  locationId: 0,
  rules: "",
  virtualTypeId: 0,
};
