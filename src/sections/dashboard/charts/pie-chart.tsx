"use client";
import React from "react";

type Segment = { label: string; value: number; color: string };

function getTotal(segments: Segment[]): number {
  return segments.reduce(
    (sum, s) => sum + (isFinite(s.value) ? s.value : 0),
    0
  );
}

export default function PieChart({
  title,
  segments,
}: {
  title: string;
  segments: Segment[];
}) {
  const size = 180;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = getTotal(segments);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s, idx) => {
      const frac = total > 0 ? s.value / total : 0;
      const len = frac * circumference;
      const isHovered = hoverIdx === idx;
      const arc = (
        <circle
          key={idx}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={s.color}
          strokeWidth={isHovered ? stroke + 4 : stroke}
          strokeDasharray={`${len} ${circumference - len}`}
          strokeDashoffset={-offset}
          style={{ transition: "stroke-width 180ms ease" }}
          onMouseEnter={() => setHoverIdx(idx)}
          onMouseLeave={() => setHoverIdx(null)}
        />
      );
      offset += len;
      return arc;
    });

  return (
    <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {arcs}
          {/* center total */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-gray-700 dark:fill-gray-200"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            {total}
          </text>
        </svg>
        <div className="text-sm space-y-2">
          {segments.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <span
                className="inline-block w-3 h-3 rounded"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1">{s.label}</span>
              <span className="font-semibold">
                {s.value}
                {total > 0 && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({Math.round((s.value / total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
