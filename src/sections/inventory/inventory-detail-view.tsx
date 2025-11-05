"use client";
import Badge from "@/components/badge/badge";
import ImagePreview from "@/components/image/image-preview";
import { InventoryProductItem, InventoryProvider } from "@/types/inventory";
import { getVariantConditionLabel } from "@/config/variant-condition-map";

interface Props {
  inventory: InventoryProvider;
}

export default function InventoryDetailView({ inventory }: Props) {
  console.log(inventory);
  return (
    <div className="space-y-6 px-4 sm:px-6 py-4">
      {/* Top header card with location + summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            {/* simple store icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 9.5V6a1 1 0 011-1h16a1 1 0 011 1v3.5M3 9.5l1.5 9A1 1 0 006 19.5h12a1 1 0 00.97-.85L21 9.5M3 9.5h18"
              />
            </svg>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between text-center sm:text-left">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {inventory.parentProductName}
                  {inventory.isPacking && (
                    <Badge variant="outline-warning" className="size-fit">
                      Paquetería
                    </Badge>
                  )}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Inventario en{" "}
                  <span className="font-semibold">{inventory.storeName}</span>
                </p>
              </div>

              <div className="mt-3 sm:mt-0 sm:text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total items
                </div>
                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {inventory.totalQuantity}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
                  />
                  <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Proveedor:
                </span>{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {inventory.supplierName}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 21l-8-5V6a2 2 0 012-2h12a2 2 0 012 2v10l-8 5z"
                  />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Almacén:
                </span>{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {inventory.warehouseName}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13 21.314l-4.657-4.657A8 8 0 1117.657 16.657z"
                  />
                  <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">
                  Ubicación:
                </span>{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {inventory.storeName} · {inventory.warehouseName}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="mb-5 flex flex-col sm:flex-row items-center sm:items-start justify-between">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalle del Inventario
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {inventory.parentProductName} — {inventory.storeName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <div className="text-center sm:text-left mb-2 sm:mb-0">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    Productos
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {inventory.products.length} items
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Cantidad total
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {inventory.totalQuantity}
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {inventory.products.map((p: InventoryProductItem) => (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                  >
                    <ImagePreview
                      className="w-20 h-20 bg-gray-100"
                      images={p.images || []}
                      alt={p.productName}
                    />

                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="text-center sm:text-left mb-2 sm:mb-0">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {p.productName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SKU: {p.sku}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            UPC: {p.upc}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            EAN: {p.ean}
                          </div>
                          <div className="mt-1">
                            <Badge variant="secondary" className="text-[10px]">
                              {getVariantConditionLabel(p.condition)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Precio
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            ${p.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                          <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md">
                            Cantidad: {p.stock}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 sm:mt-0 text-center sm:text-right">
                          Tienda: {p.storeName}
                        </div>
                      </div>

                      {p.warranty && p.warranty.isWarranty && (
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400 text-center sm:text-left">
                          Garantía: {p.warranty.warrantyTime} días
                        </div>
                      )}
                      {p.isPrime && (
                        <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 text-center sm:text-left">
                          Prime
                        </div>
                      )}
                      {p.isActive !== undefined && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 text-center sm:text-left">
                          Estado: {p.isActive ? "Activo" : "Inactivo"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Proveedor
              </h4>
              <div className="font-medium text-gray-900 dark:text-white">
                {inventory.supplierName}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Almacén
              </h4>
              <div className="font-medium text-gray-900 dark:text-white">
                {inventory.warehouseName}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Totales
              </h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Precio total:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${inventory.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Cantidad total:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {inventory.totalQuantity}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
