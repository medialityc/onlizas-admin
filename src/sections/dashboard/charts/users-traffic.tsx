"use client";
import React from "react";

function buildPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

export default function UsersTraffic({
  data,
}: {
  data: { label: string; users: number }[];
}) {
  const width = 700;
  const height = 220;
  const padding = 30;
  const max = Math.max(...data.map((d) => d.users), 1);

  const points = data.map((d, i) => {
    const x =
      padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - d.users / max) * (height - padding * 2);
    return { x, y };
  });

  const path = buildPath(points);

  // build area path (closing to bottom)
  const area = path
    ? `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`
    : "";

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md h-80">
      <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
      <div className="mt-3">
        <svg
          width="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
          {/* grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={padding}
              x2={width - padding}
              y1={padding + t * (height - padding * 2)}
              y2={padding + t * (height - padding * 2)}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
          ))}

          {/* area fill */}
          {area && <path d={area} fill="url(#gradArea)" opacity={0.55} />}

          <defs>
            <linearGradient id="gradArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="gradLine" x1="0" x2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>

          <path
            d={path}
            fill="none"
            stroke="url(#gradLine)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#fff"
              stroke="#06b6d4"
              strokeWidth={1.8}
            />
          ))}
        </svg>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        Últimos 7 días · actualizado recientemente
      </div>
    </div>
  );
}
