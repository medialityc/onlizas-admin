"use client";
import React from "react";

export default function OrderStatusPie({
  data,
}: {
  data: { label: string; value: number; color?: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = 0;
  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md h-80 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Estado de pedidos</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <svg viewBox="0 0 32 32" width="150" height="150">
            {data.map((d, i) => {
              const frac = d.value / total;
              const dash = `${frac * 100} ${100 - frac * 100}`;
              const rotate = angle * 360;
              angle += frac;
              return (
                <circle
                  key={d.label}
                  r={10}
                  cx={16}
                  cy={16}
                  fill="transparent"
                  stroke={
                    d.color ||
                    ["#06b6d4", "#4f46e5", "#f97316", "#10b981"][i % 4]
                  }
                  strokeWidth="8"
                  strokeDasharray={dash}
                  transform={`rotate(${rotate} 16 16)`}
                  style={{
                    transition:
                      "stroke-dasharray 0.6s ease, transform 0.6s ease",
                  }}
                />
              );
            })}
            <circle
              cx={16}
              cy={16}
              r={6}
              fill="currentColor"
              className="text-white dark:text-gray-900"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xs text-gray-500">Pedidos</div>
              <div className="text-sm font-semibold">{total}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-between text-sm py-1"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: d.color }}
              />
              <div className="flex flex-col">
                <div className="font-medium">{d.label}</div>
                <div className="text-xs text-gray-500">
                  {Math.round((d.value / total) * 100)}%
                </div>
              </div>
            </div>
            <div className="font-semibold">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
