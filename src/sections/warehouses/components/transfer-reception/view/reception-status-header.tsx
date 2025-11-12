"use client";

import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { formatDate } from "@/utils/format";

interface Props {
  transfer: WarehouseTransfer;
  reception: TransferReception;
}

const getStatusConfig = (status: string, isResolved: boolean) => {
  if (status === "WithDiscrepancies" && isResolved) {
    return {
      label: "Completada con Discrepancias Resueltas",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: "✅"
    };
  }
  
  switch (status) {
    case "WithDiscrepancies":
      return {
        label: "Completada con Discrepancias",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        icon: "⚠️"
      };
    case "Completed":
      return {
        label: "Completada",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: "✅"
      };
    case "Pending":
      return {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: "⏳"
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: "📋"
      };
  }
};

export const ReceptionStatusHeader: React.FC<Props> = ({ transfer, reception }) => {
  const statusConfig = getStatusConfig(reception.status, reception.isDiscrepancyResolved);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 truncate">
            Transferencia #{reception.transferNumber}
          </h1>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Origen:</span> {transfer.originWarehouseName} →
              <span className="font-medium"> Destino:</span> {reception.receivingWarehouseName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Recibida el:</span> {formatDate(reception.receivedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig.color} whitespace-nowrap`}>
            <span className="mr-1">{statusConfig.icon}</span>
            <span className="truncate max-w-32 sm:max-w-none">{statusConfig.label}</span>
          </span>
          {reception.isDiscrepancyResolved && reception.discrepancyResolvedAt && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Resuelto el {formatDate(reception.discrepancyResolvedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};