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
  AwaitingReception = "AwaitingReception",
  PartiallyReceived = "PartiallyReceived",
  ReceivedWithDiscrepancies = "ReceivedWithDiscrepancies",
  Conciliated = "Conciliated",
}

export const WAREHOUSE_TRANSFER_OPTIONS = [
  { value: WAREHOUSE_TRANSFER_STATUS.Pending, label: "Pendiente" },
  { value: WAREHOUSE_TRANSFER_STATUS.Approved, label: "Aprobado" },
  { value: WAREHOUSE_TRANSFER_STATUS.InTransit, label: "En Tránsito" },
  { value: WAREHOUSE_TRANSFER_STATUS.Completed, label: "Completado" },
  { value: WAREHOUSE_TRANSFER_STATUS.Cancelled, label: "Cancelado" },
  { value: WAREHOUSE_TRANSFER_STATUS.AwaitingReception, label: "Esperando Recepción" },
  { value: WAREHOUSE_TRANSFER_STATUS.PartiallyReceived, label: "Parcialmente Recibido" },
  { value: WAREHOUSE_TRANSFER_STATUS.ReceivedWithDiscrepancies, label: "Recibido con Discrepancias" },
  { value: WAREHOUSE_TRANSFER_STATUS.Conciliated, label: "Conciliado" },
];

export type WarehouseTransfer = {
  id: string;
  transferNumber: string;
  originId: string;
  originWarehouseName: string;
  destinationId: string;
  destinationWarehouseName: string;
  status: WAREHOUSE_TRANSFER_STATUS;
  createdAt: Date;
  updatedAt: Date;
  items: [
    {
      id: string;
      productVariantId: number;
      productName:string
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
  warehouseId?: string | number;
  fromDate?: string;
  toDate?: string;
};

export type GetAllWarehouses = PaginatedResponse<WarehouseFormData>;
