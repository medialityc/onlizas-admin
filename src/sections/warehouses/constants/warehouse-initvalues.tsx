import { WarehouseFormData } from "../schemas/warehouse-schema";
import {
  WAREHOUSE_VIRTUAL_SUBTYPE_ENUM,
  WAREHOUSE_TYPE_ENUM,
} from "./warehouse-type";

export const defaultWarehouseFormData: WarehouseFormData = {
  name: "",
  type: WAREHOUSE_TYPE_ENUM.virtual,
  isActive: false,
  description: "",
  maxCapacity: undefined,
  currentCapacity: 0,
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  locationId: 1,
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  coordinates: undefined,
  virtualSubType: WAREHOUSE_VIRTUAL_SUBTYPE_ENUM.general,
  virtualRules: {
    allowsManualInventory: true,
    requiresApprovalToExit: false,
    requiresInspection: false,
    allowsCrossDocking: true,
    priorityLevel: "low",
    notificationRules: {
      notifyOnEntry: false,
      notifyOnExit: false,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  linkedPhysicalWarehouseId: undefined,
  supplierId: undefined,
};
