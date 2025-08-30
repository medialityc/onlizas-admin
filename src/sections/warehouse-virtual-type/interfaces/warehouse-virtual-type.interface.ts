import { PaginatedResponse } from "@/types/common";
import { WarehouseVirtualTypeFormData } from "../schemas/warehouse-virtual-type-schema";

export type GetAllWarehousesVirtualType = PaginatedResponse<WarehouseVirtualTypeFormData>;
