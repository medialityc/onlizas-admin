"use client";

import React from "react";

type Variant = {
  id: number;
  name: string;
  available: number;
  storage?: string;
  color?: string;
  processor?: string;
  price?: string;
};

export type InventoryItem = {
  id: number;
  productName: string;
  category: string;
  supplier: string;
  warehouseId: number;
  variants: Variant[];
  lastUpdated: string;
};

function highlight(text: string, query: string) {
  if (!query) return text;
  try {
    const re = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "ig"
    );
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part) ? (
            <mark
              key={i}
              className="bg-yellow-200/60 dark:bg-yellow-500/30 rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </>
    );
  } catch {
    return text;
  }
}

export function InventoryCard({
  item,
  query,
}: {
  item: InventoryItem;
  query: string;
}) {
  const total = item.variants.reduce((acc, v) => acc + v.available, 0);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {highlight(item.productName, query)}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 px-2 py-0.5 ring-1 ring-inset ring-blue-600/20">
              {highlight(item.category, query)}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 px-2 py-0.5 ring-1 ring-inset ring-emerald-600/20">
              {highlight(item.supplier, query)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              Actualizado: {item.lastUpdated}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total unidades
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {total}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Variantes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {item.variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-4 border border-gray-100 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {highlight(variant.name, query)}
                  </h5>
                  <div className="mt-2 text-xs flex flex-wrap gap-2 text-gray-600 dark:text-gray-300">
                    {variant.storage && (
                      <span className="inline-flex items-center rounded bg-white dark:bg-gray-800 px-2 py-0.5 border border-gray-200 dark:border-gray-600">
                        Almacenamiento: {highlight(variant.storage, query)}
                      </span>
                    )}
                    {"color" in variant && variant.color && (
                      <span className="inline-flex items-center rounded bg-white dark:bg-gray-800 px-2 py-0.5 border border-gray-200 dark:border-gray-600">
                        Color: {highlight(variant.color, query)}
                      </span>
                    )}
                    {"processor" in variant && variant.processor && (
                      <span className="inline-flex items-center rounded bg-white dark:bg-gray-800 px-2 py-0.5 border border-gray-200 dark:border-gray-600">
                        Procesador: {highlight(variant.processor, query)}
                      </span>
                    )}
                    {variant.price && (
                      <span className="inline-flex items-center rounded bg-white dark:bg-gray-800 px-2 py-0.5 border border-gray-200 dark:border-gray-600">
                        {variant.price}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {variant.available}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Disponible
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InventoryCard;
