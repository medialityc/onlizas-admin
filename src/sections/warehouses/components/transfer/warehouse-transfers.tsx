"use client";

import { WarehouseFormData } from "../../schemas/warehouse-schema";

interface WarehouseTransfersProps {
  warehouse: WarehouseFormData;
}

export function WarehouseTransfers({ warehouse }: WarehouseTransfersProps) {
  console.log(warehouse);
  // const onSubmit = handleSubmit((data) => {
  //   handleTransfer();
  // });
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Transferencias de Inventario
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Inventario del almacén actual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventario del almacén actual
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Selección actual:
            </div>
          </div>
        </div>

        {/* Columna derecha: Selector de destino + carrito */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Seleccionar almacén destino
            </h3>
            {/*   <DestinationSelect methods={methods} options={warehouseOptions} /> */}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inventario seleccionado
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total: 100 unidades
              </span>
            </div>
            {/* {Object.keys(cart).length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aún no has agregado productos a la transferencia.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.values(cart).map((entry) => (
                  <div
                    key={entry.item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {entry.item.productName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.item.category} - {entry.item.supplier}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(entry.item.id)}
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        title="Quitar del carrito"
                      >
                        Quitar
                      </button>
                    </div>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {entry.item.variants
                        .filter((v: any) => entry.quantities[v.id] > 0)
                        .map((v: any) => (
                          <li key={v.id} className="flex justify-between">
                            <span>
                              {v.name}
                              {v.storage ? ` · ${v.storage}` : ""}
                              {v.color ? ` · ${v.color}` : ""}
                            </span>
                            <span className="font-medium">
                              x{entry.quantities[v.id]}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )} */}

            <div className="mt-4 flex justify-end">
              {/*  <Button
                variant="primary"
                onClick={handleTransfer}
                disabled={!watchedDestinationId || cartTotalItems === 0}
              >
                Confirmar transferencia
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
