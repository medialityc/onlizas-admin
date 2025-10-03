"use client";

import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface Props {
  reception: TransferReception;
  warehouse: WarehouseFormData;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ReceptionDocumentationTab({ reception: _reception, warehouse: _warehouse }: Props) {
  return (
    <div className="space-y-6">
      {/* Header de Documentación */}
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium text-dark dark:text-white-light">
          Documentación
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Documentos y archivos relacionados con la recepción de transferencia
      </p>

      {/* Placeholder para documentación */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          🚧 Sección de documentación en desarrollo
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
          Aquí se mostrarán los documentos asociados a la recepción
        </p>
      </div>

      {/* Lista placeholder de documentos */}
      <div className="space-y-3">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-dark dark:text-white-light">
                Documento de Transferencia
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PDF • Generado automáticamente
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
              Descargar
            </button>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-dark dark:text-white-light">
                Acta de Recepción
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PDF • Se generará al completar la recepción
              </p>
            </div>
            <button
              disabled
              className="text-gray-400 dark:text-gray-500 text-sm font-medium cursor-not-allowed"
            >
              Pendiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}