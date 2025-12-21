"use client";
import React from "react";

type Activity = {
  type: string;
  description: string;
  timestamp: string;
  userName?: string;
  reference?: string;
};

function typeColor(type: string) {
  const t = type.toLowerCase();
  if (t.includes("order")) return "#10b981";
  if (t.includes("review")) return "#f59e0b";
  return "#06b6d4";
}

function formatDate(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function RecentActivityTimeline({
  title,
  activities,
}: {
  title: string;
  activities: Activity[];
}) {
  const [filter, setFilter] = React.useState<string>("all");
  const filtered = activities.filter(
    (a) => filter === "all" || a.type.toLowerCase().includes(filter)
  );

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2 text-xs">
          <button
            className={`px-2 py-1 rounded border ${filter === "all" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`px-2 py-1 rounded border ${filter === "order" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            onClick={() => setFilter("order")}
          >
            Órdenes
          </button>
          <button
            className={`px-2 py-1 rounded border ${filter === "review" ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            onClick={() => setFilter("review")}
          >
            Reviews
          </button>
        </div>
      </div>
      <ul className="mt-4 space-y-4">
        {filtered.slice(0, 10).map((a, idx) => (
          <li key={idx} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: typeColor(a.type) }}
              />
              <span className="flex-1 w-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{a.description}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(a.timestamp)}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span
                  className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 mr-2"
                  style={{ color: typeColor(a.type) }}
                >
                  {a.type}
                </span>
                {a.userName && <span>Por: {a.userName}</span>}
                {a.reference && <span>Ref: {a.reference}</span>}
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-gray-500">No hay actividad.</li>
        )}
      </ul>
    </div>
  );
}
