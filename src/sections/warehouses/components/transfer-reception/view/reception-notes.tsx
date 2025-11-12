"use client";

import { TransferReception } from "@/types/warehouse-transfer-receptions";

interface Props {
  reception: TransferReception;
}

export const ReceptionNotes: React.FC<Props> = ({ reception }) => {
  if (!reception.notes || reception.notes.trim().length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Observaciones de la Recepción
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Notas adicionales del proceso
            </p>
          </div>
        </div>
        
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No se agregaron observaciones para esta recepción
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Observaciones de la Recepción
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Notas adicionales del proceso
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
          {reception.notes}
        </p>
      </div>
    </div>
  );
};