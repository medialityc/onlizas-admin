import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";
import { PaginatedResponse } from "./common";

export interface PaginatedTransferResponse<T> extends PaginatedResponse<T> {
  transfers: T[];
}

export enum WAREHOUSE_TRANSFER_STATUS {
  Pending = "Pending",
  Approved = "Approved",
  InTransit = "InTransit",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export const WAREHOUSE_TRANSFER_OPTIONS = [
  { value: WAREHOUSE_TRANSFER_STATUS.Pending, label: "Pendiente" },
  { value: WAREHOUSE_TRANSFER_STATUS.InTransit, label: "En transferencia" },
  { value: WAREHOUSE_TRANSFER_STATUS.Approved, label: "Aprobado" },
  { value: WAREHOUSE_TRANSFER_STATUS.Completed, label: "Completado" },
  { value: WAREHOUSE_TRANSFER_STATUS.Cancelled, label: "Cancelado" },
];

export type WarehouseTransfer = {
  id: number;
  transferNumber: string;
  originId: number;
  originWarehouseName: string;
  destinationId: number;
  destinationWarehouseName: string;
  status: WAREHOUSE_TRANSFER_STATUS;
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
  status?: string;
  warehouseId?: string;
  fromDate?: string;
  toDate?: string;
};

export type GetAllWarehouses = PaginatedResponse<WarehouseFormData>;
