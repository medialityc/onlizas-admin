"use client";

import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { formatDate } from "@/utils/format";

interface Props {
  reception: TransferReception;
}

export const DiscrepancySection: React.FC<Props> = ({ reception }) => {
  const hasDiscrepancies = reception.discrepancyDescription && reception.discrepancyDescription.length > 0;

  if (!hasDiscrepancies) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Estado de Discrepancias
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recepción sin incidencias
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 dark:text-green-300 font-medium">
            ✅ No se reportaron discrepancias en esta recepción
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-6 ${
      reception.isDiscrepancyResolved 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          reception.isDiscrepancyResolved 
            ? 'bg-green-100 dark:bg-green-800' 
            : 'bg-orange-100 dark:bg-orange-800'
        }`}>
          {reception.isDiscrepancyResolved ? (
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Discrepancias Identificadas
          </h3>
          <p className={`text-sm ${
            reception.isDiscrepancyResolved 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {reception.isDiscrepancyResolved ? '✅ Resueltas' : '⚠️ Pendientes de resolución'}
          </p>
        </div>
      </div>

      {/* Descripción de las discrepancias */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Descripción de Discrepancias:
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {reception.discrepancyDescription}
        </p>
      </div>

      {/* Información de resolución */}
      {reception.isDiscrepancyResolved && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-900 dark:text-green-100">
              🎉 Discrepancias Resueltas
            </h4>
            <span className="text-xs text-green-600 dark:text-green-400">
              {formatDate(reception.discrepancyResolvedAt)}
            </span>
          </div>
          {reception.resolutionDescription && (
            <p className="text-sm text-green-700 dark:text-green-300">
              <span className="font-medium">Resolución:</span> {reception.resolutionDescription}
            </p>
          )}
        </div>
      )}
    </div>
  );
};