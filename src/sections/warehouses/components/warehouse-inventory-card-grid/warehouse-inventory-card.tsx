"use client";

import Badge from "@/components/badge/badge";
import React from "react";
import ProductVariantCard from "../warehouse-form/components/porduct-variant-card/porduct-variant-card";
import { InventoryProvider } from "@/types/inventory";

export function WarehouseInventoryCard({ item }: { item: InventoryProvider }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.parentProductName}
          </h3>
          <div className="flex flex-row gap-2">
            <div className="flex flex-wrap items-center gap-2  text-xs">
              <h4 className="text-sm font-semibold">Proveedor:</h4>
              <Badge variant="success">{item.supplierName}</Badge>
            </div>

            <div className="flex flex-row gap-1 items-center">
              Tienda:
              <Badge variant="primary">{item.storeName}</Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Cantidad total
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {item?.totalQuantity}
          </div>
        </div>
      </div>

      {item?.products?.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Variantes
          </h4>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {item.products.map((variant) => (
              <ProductVariantCard variant={variant} key={variant?.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 w-full flex justify-center items-center text-lg bg-slate-100 dark:bg-slate-900 ">
          El producto no tiene variantes definidas
        </div>
      )}
    </div>
  );
}

export default WarehouseInventoryCard;
