import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

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
): "physical" | "virtual" | string => {
  switch (type) {
    case WAREHOUSE_TYPE_ENUM.warehouse:
    case "Warehouse":
      return "physical";

    case WAREHOUSE_TYPE_ENUM.virtualwarehouse:
    case "Virtualwarehouse":
      return "virtual";

    default:
      return type;
  }
};
