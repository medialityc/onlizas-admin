"use client";
import React from "react";

export default function TopStores({
  data,
}: {
  data: { name: string; sales: number }[];
}) {
  const max = Math.max(...data.map((d) => d.sales), 1);

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md h-80">
      <h3 className="text-lg font-semibold mb-3">Tiendas más populares</h3>
      <div className="flex flex-col gap-3 mt-2">
        {data.map((d, idx) => (
          <div
            className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
            key={d.name}
          >
            <div className="w-36 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <span className="inline-block w-6 text-right mr-2 text-gray-400">
                {idx + 1}
              </span>
              {d.name}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-4 relative overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style={{ width: `${(d.sales / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-20 text-right text-sm font-semibold text-gray-800 dark:text-gray-100">
              {d.sales}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
