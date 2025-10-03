"use client";

import Badge from "@/components/badge/badge";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import TransferStatusCell from "../transfer-cell/transfer-status-cell";

interface Props {
  transfer: WarehouseTransfer;
}

export default function TransferReceptionHeader({ transfer }: Props) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
      {/* Título y estado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {transfer.transferNumber}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transferencia desde {transfer.originWarehouseName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <TransferStatusCell status={transfer.status} />
        </div>
      </div>

      {/* Información de la transferencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Origen
          </label>
          <p className="text-sm text-gray-900 dark:text-white font-medium">
            {transfer.originWarehouseName}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Destino
          </label>
          <p className="text-sm text-gray-900 dark:text-white font-medium">
            {transfer.destinationWarehouseName}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Envío
          </label>
          <p className="text-sm text-gray-900 dark:text-white font-medium">
            {new Date(transfer.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}