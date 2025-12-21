"use client";
import React from "react";

type Metric = { label: string; value: number | string; color?: string };
export type SummarySection = { title: string; items: Metric[] };

function MetricCard({ m }: { m: Metric }) {
  const color = m.color ?? "#4f46e5";
  return (
    <div className="p-3 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500">{m.label}</div>
          <div className="text-lg font-semibold" style={{ color }}>
            {m.value}
          </div>
        </div>
        <span
          className="inline-block w-6 h-6 rounded-full"
          style={{ background: color, opacity: 0.12 }}
        />
      </div>
    </div>
  );
}

export default function GroupedSummary({
  sections,
}: {
  sections: SummarySection[];
}) {
  return (
    <div className="space-y-4">
      {sections.map((s, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 shadow-sm"
        >
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            {s.title}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {s.items.map((m, i) => (
              <MetricCard key={`${s.title}-${i}`} m={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
