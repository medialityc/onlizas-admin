"use client";
import React from "react";

export default function SalesFunnel({
  stages,
}: {
  stages: { label: string; value: number; color?: string }[];
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);
  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Sales Funnel</h3>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {stages.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
          >
            <div className="w-36 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {s.label}
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                <div
                  className="h-6 rounded-full"
                  style={{
                    width: `${(s.value / max) * 100}%`,
                    background:
                      s.color || `linear-gradient(90deg, #4f46e5, #06b6d4)`,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
            <div className="w-24 text-right font-semibold">
              {s.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
