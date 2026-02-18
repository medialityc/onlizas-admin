import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.warehouse,
  active: false,
  address: {
    name: "Principal",
    mainStreet: "",
    difficultAccessArea: false,
    number: "",
    otherStreets: "",
    city: "",
    countryId: "",
    zipcode: "",
    annotations: "",
    districtId: "",
  },
  capacity: 0,
  capacityUnit: "KG",
  supplierId: undefined,
};
export const initValueMeWarehouse: MeWarehouseFormData = {
  name: "",
  active: false,
  address: {
    name: "Principal",
    mainStreet: "",
    difficultAccessArea: false,
    number: "",
    otherStreets: "",
    city: "",
    countryId: "",
    zipcode: "",
    annotations: "",
    districtId: "",
  },
  rules: "",
};
