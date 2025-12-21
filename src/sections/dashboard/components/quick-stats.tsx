"use client";
import React from "react";

type QuickItem = {
  label: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
};

function DefaultIcon({ color = "#06b6d4" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M7 12h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function QuickStats({ items }: { items: QuickItem[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-1">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="inline-block w-6 h-6">
            {it.icon ?? <DefaultIcon color={it.color} />}
          </span>
          <div>
            <div className="text-xs text-gray-500">{it.label}</div>
            <div
              className="text-sm font-semibold"
              style={{ color: it.color ?? "inherit" }}
            >
              {it.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
