import React from "react";
import {
  InventoryProvider,
  InventoryProductItem,
} from "@/services/inventory-providers";

export const InventoryDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-6">
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

interface Props {
  inventory: InventoryProvider;
}

export default function InventoryDetailView({ inventory }: Props) {
  return (
    <div className="space-y-6">
      {/* Top header card with location + summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/10 dark:to-black/20 p-6 rounded-lg border">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/60 dark:bg-black/30 rounded-lg flex items-center justify-center shadow">
            {/* simple store icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-indigo-600"
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

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white-light">
                  {inventory.parentProductName}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Inventario en{" "}
                  <span className="font-semibold">{inventory.storeName}</span>
                </p>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Total items</div>
                <div className="text-2xl font-semibold">
                  {inventory.totalQuantity}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/30 border px-3 py-1 rounded-full text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
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
                Proveedor:{" "}
                <span className="font-medium ml-1">
                  {inventory.supplierName}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/30 border px-3 py-1 rounded-full text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
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
                Almacén:{" "}
                <span className="font-medium ml-1">
                  {inventory.warehouseName}
                </span>
              </span>

              <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/30 border px-3 py-1 rounded-full text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500"
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
                Ubicación:{" "}
                <span className="font-medium ml-1">
                  {inventory.storeName} · {inventory.warehouseName}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dark dark:text-white-light">
              Detalle del Inventario
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {inventory.parentProductName} — {inventory.storeName}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Productos</h3>
                  <p className="text-sm text-gray-500">
                    {inventory.products.length} items
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Cantidad total</div>
                  <div className="font-semibold">{inventory.totalQuantity}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {inventory.products.map((p: InventoryProductItem) => (
                  <div
                    key={p.id}
                    className="flex items-start gap-4 p-3 border rounded"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {p.images && p.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.productName}</div>
                          <div className="text-sm text-gray-500">
                            SKU: {p.productId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Precio</div>
                          <div className="font-semibold">
                            {p.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Cantidad: {p.quantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          Tienda: {p.storeName}
                        </div>
                      </div>

                      {p.warranty && p.warranty.isWarranty && (
                        <div className="mt-2 text-sm text-green-600">
                          Garantía: {p.warranty.warrantyTime} días
                        </div>
                      )}

                      {p.details && p.details.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                          {p.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <h4 className="text-sm text-gray-500">Proveedor</h4>
              <div className="font-medium">{inventory.supplierName}</div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h4 className="text-sm text-gray-500">Almacén</h4>
              <div className="font-medium">{inventory.warehouseName}</div>
            </div>

            <div className="bg-white rounded-lg border p-4">
              <h4 className="text-sm text-gray-500">Totales</h4>
              <div className="mt-2 text-sm text-gray-600">
                Precio total:{" "}
                <span className="font-semibold">
                  {inventory.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Cantidad total:{" "}
                <span className="font-semibold">{inventory.totalQuantity}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
