import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const CUBA_COUNTRY_ID = "c1c9c1b7-3757-4294-9591-970fba64c681";

export const initValueWarehouse: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.virtualwarehouse,
  active: false,
  address: {
    name: "",
    mainStreet: "",
    difficultAccessArea: false,
    number: "",
    otherStreets: "",
    city: "",
    countryId: CUBA_COUNTRY_ID,
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
    name: "",
    mainStreet: "",
    difficultAccessArea: false,
    number: "",
    otherStreets: "",
    city: "",
    countryId: undefined,
    zipcode: "",
    annotations: "",
    districtId: "",
  },
  rules: "",
};
