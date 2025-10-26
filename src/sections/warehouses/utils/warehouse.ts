import {
  WAREHOUSE_TYPE_ENUM,
  WAREHOUSE_TYPE_ROUTE_ENUM,
} from "../constants/warehouse-type";

export const generateWarehouseTransferNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const currentDate = year + month + day;

  const randomDigits = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");

  return `TX${currentDate}${randomDigits}`;
};

export const getWarehouseRoute = (
  type: WAREHOUSE_TYPE_ENUM | string
): WAREHOUSE_TYPE_ROUTE_ENUM => {
  switch (type) {
    case WAREHOUSE_TYPE_ENUM.Warehouse:
    case WAREHOUSE_TYPE_ENUM.warehouse:
      return WAREHOUSE_TYPE_ROUTE_ENUM.physical;

    case WAREHOUSE_TYPE_ENUM.VirtualWarehouse:
    case WAREHOUSE_TYPE_ENUM.virtualwarehouse:
      return WAREHOUSE_TYPE_ROUTE_ENUM.virtual;
    default:
      return WAREHOUSE_TYPE_ROUTE_ENUM.physical;
  }
};
