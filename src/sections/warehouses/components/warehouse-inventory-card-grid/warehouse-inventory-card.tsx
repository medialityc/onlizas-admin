"use client";

import Badge from "@/components/badge/badge";
import { InventoryProvider } from "@/services/inventory-providers";
import { detailsObjectToArray } from "@/utils/format";

import Image from "next/image";
import React from "react";

export function WarehouseInventoryCard({ item }: { item: InventoryProvider }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.parentProductName}
          </h3>
          <div className="flex flex-wrap items-center gap-2  text-xs">
            <h4 className="text-sm font-semibold">Proveedor:</h4>
            <Badge variant="success">{item.supplierName}</Badge>
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

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Variantes
        </h4>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {item.products.map((variant) => (
            <div
              key={variant.id}
              className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-2 border border-gray-100 dark:border-gray-600"
            >
              <div className="flex flex-row gap-2 items-start">
                <div className="  object-contain w-16 h-16 bg-slate-100 border dark:border-slate-700 dark:bg-slate-700 rounded-md overflow-hidden relative">
                  <Image
                    src={
                      variant?.images?.[0] ||
                      "/assets/images/placeholder-product.webp"
                    }
                    alt={variant?.productName}
                    fill
                  />
                </div>
                <div className="flex w-full gap-1 flex-1 flex-wrap xl:flex-row justify-between font-medium text-gray-900 dark:text-white">
                  <div>
                    <h5 className="text-lg leading-none">
                      {variant.productName}
                    </h5>
                    {variant.storeName && (
                      <div className="flex flex-row gap-1 items-center">
                        Tienda:
                        <Badge variant="primary">{variant.storeName}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row gap-1 items-center mb-auto">
                    <span className="font-bold">Precio:</span> ${variant.price}
                    {variant.discountedPrice && (
                      <Badge variant="danger" className="m-0">
                        {variant.discountedPrice || 0}
                        {variant?.discountType === 0 ? "%" : "$"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className=" mt-2 text-xs flex flex-wrap gap-2 text-gray-600 dark:text-gray-300">
                {variant.quantity && (
                  <Badge variant="outline-info">
                    Cantidad: {variant.quantity || 0}
                  </Badge>
                )}

                {variant.details &&
                  detailsObjectToArray(variant.details).map((detail) => (
                    <Badge variant="outline-warning" key={detail.key}>
                      ${detail.key}: {detail.value}
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WarehouseInventoryCard;
