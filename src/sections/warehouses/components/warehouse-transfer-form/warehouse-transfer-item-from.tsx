"use client";
import React from "react";
import { Package, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { useWarehouseInventoryActions } from "../../contexts/warehouse-inventory-transfer.stote";

interface GroupedInventory {
  inventoryId: number;
  parentProductName: string;
  products: {
    [key: string]: {
      productName: string;
      totalStock: number;
      unit: string;
      variants: {
        variantId: number;
        variantName: string;
        stock: number;
        allowPartialFulfillment: boolean;
      }[];
    };
  };
  totalStock: number;
  hasPartialFulfillment: boolean;
}

const TransferSummary: React.FC = () => {
  const { items } = useWarehouseInventoryActions();

  // Agrupar productos por inventoryId
  const groupedByInventory = items.reduce<Record<number, GroupedInventory>>(
    (acc, item) => {
      const key = item.inventoryId;
      if (!acc[key]) {
        acc[key] = {
          inventoryId: item.inventoryId,
          parentProductName: item?.parentProductName,
          products: {},
          totalStock: 0,
          hasPartialFulfillment: false,
        };
      }

      // Agrupar productos dentro de cada inventario
      const productKey = item.parentProductName;
      if (!acc[key].products[productKey]) {
        acc[key].products[productKey] = {
          productName: item.parentProductName,
          totalStock: 0,
          unit: item.unit,
          variants: [],
        };
      }

      acc[key].products[productKey].totalStock += item.quantityRequested;
      acc[key].products[productKey].variants.push({
        variantId: item.productVariantId,
        variantName: item.variantName,
        stock: item.quantityRequested,
        allowPartialFulfillment: item.allowPartialFulfillment,
      });
      acc[key].totalStock += item.quantityRequested;

      // Verificar si hay cumplimiento parcial en este inventario
      if (item.allowPartialFulfillment) {
        acc[key].hasPartialFulfillment = true;
      }

      return acc;
    },
    {}
  );

  const inventoryList = Object.values(groupedByInventory);

  if (items?.length === 0) return <></>;

  return (
    <footer className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Resumen de transferencias
      </h3>

      <div className="flex flex-col gap-2">
        {inventoryList.map((inventory, inventoryIndex) => (
          <div
            key={inventoryIndex}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-2 py-3 shadow-sm"
          >
            {/* Header del inventario */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {inventory.parentProductName}
                </h4>
                {inventory.hasPartialFulfillment && (
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Cumplimiento parcial</span>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                Total: {inventory.totalStock} items
              </div>
            </div>

            {/* Productos del inventario */}
            <div className="flex flex-row gap-4 flex-wrap">
              {Object.values(inventory.products).map(
                (product, productIndex) => (
                  <div key={productIndex} className="space-y-3">
                    {/* Variantes del producto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.variantId}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                                {variant.stock} {product.unit}
                              </span>
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium line-clamp-2">
                              {variant.variantName}
                            </p>
                            {variant.allowPartialFulfillment && (
                              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Parcial permitido</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen total si hay múltiples inventarios */}
      {inventoryList.length > 1 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Total de inventarios: {inventoryList.length}
              </span>
              {inventoryList.some(inv => inv.hasPartialFulfillment) && (
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Algunos con cumplimiento parcial</span>
                </div>
              )}
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
              {inventoryList.reduce(
                (total, inv) => total + inv.totalStock,
                0
              )}{" "}
              productos totales
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default TransferSummary;