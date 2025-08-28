import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";
import { PaginatedResponse } from "./common";

export interface PaginatedTransferResponse<T> extends PaginatedResponse<T> {
  transfers: T[];
}

export type WarehouseTransfer = {
  id?: number;
  transferNumber: string;
  originId: number;
  originWarehouseName: string;
  destinationId: number;
  destinationWarehouseName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: [
    {
      id: number;
      productVariantId: number;
      productVariantName: string;
      quantityRequested: number;
      quantityTransferred: number;
      unit: string;
      allocations: [
        {
          id: number;
          productVariantId: number;
          productVariantName: string;
          quantity: number;
          availableQuantity: number;
        },
      ];
    },
  ];
};

export type GetAllWarehouseTransfers =
  PaginatedTransferResponse<WarehouseTransfer>;

export type WarehouseTransferFilter = {
  search?: string;
  status?: string;
  originId?: number;
  destinationId?: number;
  fromDate?: string;
  toDate?: string;
};

export type GetAllWarehouses = PaginatedResponse<WarehouseFormData>;
