import React from "react";
import { WarehouseTransfer } from "@/types/warehouses-transfers";

interface ReceptionSummaryProps {
  transfer: WarehouseTransfer;
  receptionData?: any;
  isReceptionCompleted?: boolean;
}

export function ReceptionSummary({
  transfer,
  receptionData,
  isReceptionCompleted,
}: ReceptionSummaryProps) {
  const formatDate = (dateInput: string | Date | undefined) => {
    if (!dateInput) return "No disponible";
    
    try {
      let date: Date;
      
      if (dateInput instanceof Date) {
        date = dateInput;
      } else {
        date = new Date(dateInput);
      }
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "short", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Error en fecha";
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            Información de la Transferencia
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">ID:</span> {transfer.id}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Origen:</span> {transfer.originWarehouseName}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Destino:</span> {transfer.destinationWarehouseName}
              </p>
            </div>
            
            <div>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Estado:</span> {transfer.status}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                <span className="font-medium">Productos esperados:</span> {transfer.items?.length || 0}
              </p>
              {transfer.createdAt && (
                <p className="text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Creada:</span> {formatDate(transfer.createdAt)}
                </p>
              )}
            </div>
          </div>

          {isReceptionCompleted && receptionData && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-600">Recepción Completada</span>
              </div>
              
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p><span className="font-medium">ID de Recepción:</span> {receptionData.id}</p>
                {receptionData.receivedAt && (
                  <p><span className="font-medium">Recibida el:</span> {formatDate(receptionData.receivedAt)}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {!isReceptionCompleted && (
          <div className="text-right">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Estado
              </div>
              <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Pendiente de Recepción
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}