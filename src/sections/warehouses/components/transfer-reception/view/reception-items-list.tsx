"use client";

import { TransferReceptionItem } from "@/types/warehouse-transfer-receptions";

interface Props {
  items: TransferReceptionItem[];
}

const getItemStatusConfig = (item: TransferReceptionItem) => {
  const hasDiscrepancy = item.quantityReceived !== item.quantityExpected;
  
  if (hasDiscrepancy) {
    return {
      label: "Con Discrepancia",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      icon: "⚠️"
    };
  }
  
  return {
    label: "Conforme",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", 
    icon: "✅"
  };
};

export const ReceptionItemsList: React.FC<Props> = ({ items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Productos Recepcionados
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total de {items.length} producto{items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const statusConfig = getItemStatusConfig(item);
          
          return (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Variante: {item.productVariantName}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Esperado:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {item.quantityExpected} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Recibido:</span>
                      <span className={`ml-2 font-medium ${
                        item.quantityReceived === item.quantityExpected 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {item.quantityReceived} {item.unit}
                      </span>
                    </div>
                  </div>

                  {item.receivedBatch && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span className="font-medium">Lote:</span> {item.receivedBatch}
                    </p>
                  )}
                  
                  {item.receivedExpiryDate && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Vencimiento:</span> {new Date(item.receivedExpiryDate).toLocaleDateString()}
                    </p>
                  )}
                  
                  {item.discrepancyNotes && (
                    <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-medium">Notas de discrepancia:</span> {item.discrepancyNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};