"use client";

import { WarehouseTransfer } from "@/types/warehouses-transfers";

interface Props {
  transfer: WarehouseTransfer;
  receptionData: any;
}

export default function TransferReceptionView({ transfer, receptionData }: Props) {
  return (
    <div className="space-y-6">
      {/* Paso 1: Recepción de Productos - Solo Lectura */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Productos Recepcionados
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vista de solo lectura de los productos recepcionados
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {transfer.items?.map((item, index) => {
            const receptionItem = receptionData.items?.find((ri: any) => ri.transferItemId === item.id);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.productVariantName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad transferida: {item.quantityRequested} {item.unit}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Cantidad recibida: {receptionItem?.quantityReceived || 0} {item.unit}
                    </p>
                    {receptionItem?.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Notas: {receptionItem.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paso 2: Gestión de Incidencias - Solo Lectura */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Incidencias Reportadas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vista de solo lectura de las incidencias durante la recepción
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            No se reportaron incidencias durante esta recepción
          </p>
        </div>
      </div>

      {/* Paso 3: Comunicación - Solo Lectura */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8 9-8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Comunicación
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comentarios intercambiados durante la recepción
            </p>
          </div>
        </div>

        {/* Lista de comentarios */}
        <div className="mb-4 max-h-60 overflow-y-auto">
          {receptionData.comments && receptionData.comments.length > 0 ? (
            <div className="space-y-3">
              {receptionData.comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay comentarios
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Información General */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Información General
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado de la Recepción
            </label>
            <div className="text-sm text-gray-900 dark:text-white">
              {receptionData.status === 'completed' ? 'Completada' : 'En Progreso'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Recepción
            </label>
            <div className="text-sm text-gray-900 dark:text-white">
              {new Date(receptionData.receivedAt).toLocaleDateString()}
            </div>
          </div>

          {receptionData.notes && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observaciones Generales
              </label>
              <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {receptionData.notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}