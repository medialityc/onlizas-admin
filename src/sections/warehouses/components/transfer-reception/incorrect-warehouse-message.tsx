"use client";

import Link from "next/link";

interface Props {
  transfer: any;
  currentWarehouseId: string;
  currentWarehouseType: string;
  transferId: string;
}

export default function IncorrectWarehouseMessage({
  transfer,
  currentWarehouseId,
  currentWarehouseType,
  transferId
}: Props) {
  const correctUrl = `/dashboard/warehouses/${currentWarehouseType}/${transfer.destinationId}/reception/${transferId}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Almacén Incorrecto
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Esta transferencia debe recepcionarse en <strong>{transfer.destinationWarehouseName}</strong>, no desde {transfer.originWarehouseName}.
          </p>
          <div className="space-y-3">
            <Link
              href={correctUrl}
              className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Ir al Almacén Destino
            </Link>
            <Link
              href={`/dashboard/warehouses/${currentWarehouseType}/${currentWarehouseId}/transfers/list`}
              className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Volver a Lista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}