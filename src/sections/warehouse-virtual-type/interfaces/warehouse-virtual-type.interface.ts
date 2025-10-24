import { PaginatedResponse } from "@/types/common";
import { WarehouseVirtualTypeFormData } from "../schemas/warehouse-virtual-type-schema";

export type GetAllWarehousesVirtualType = PaginatedResponse<WarehouseVirtualTypeFormData>;

export type CanDeleteWarehouseVirtualTypeResponse = {
  id: string;
  name: string;
  canDelete: boolean;
  reason: string;
  virtualWarehousesCount: number;
};

export type WarehouseVirtualTypeDetails = {
  id: string;
  name: string;
  defaultRules: string;
  active: boolean;
  virtualWarehousesCount: number;
  createdDatetime: string;
  updatedDatetime: string;
};
