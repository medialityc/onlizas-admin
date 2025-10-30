"use client";
import React from "react";

export default function TopProducts({
  data,
}: {
  data: { name: string; qty: number }[];
}) {
  const max = Math.max(...data.map((d) => d.qty), 1);

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md h-80">
      <h3 className="text-lg font-semibold mb-3">Productos más vendidos</h3>
      <div className="flex flex-col gap-3 mt-2">
        {data.map((d, idx) => (
          <div
            className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
            key={d.name}
          >
            <div className="w-36 text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                {idx + 1}
              </div>
              <span className="truncate">{d.name}</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{ width: `${(d.qty / max) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-20 text-right text-sm font-semibold text-gray-800 dark:text-gray-100">
              {d.qty}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
