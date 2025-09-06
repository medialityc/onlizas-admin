"use client";

import MetricStatCard from "../../components/metric-stat-card";
import { GiftIcon, UsersIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

type PromotionsMetricsProps = {
  total: number;
  active: number;
  uses: number;
  expired: number;
};

export default function PromotionsMetrics({ total, active, uses, expired }: PromotionsMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <style>{`
        /* metric-icon transparent backgrounds tuned to icon color */
        .metric-icon.text-indigo-600 { background-color: rgba(99,102,241,0.08); }
        .metric-icon.text-emerald-600 { background-color: rgba(16,185,129,0.08); }
        .metric-icon.text-violet-600 { background-color: rgba(139,92,246,0.08); }
        .metric-icon.text-rose-600 { background-color: rgba(244,63,94,0.08); }
        .metric-icon { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; }
      `}</style>

      <MetricStatCard label="Total Promociones" value={total} icon={<GiftIcon className="text-indigo-600" />} />
      <MetricStatCard label="Promociones Activas" value={active} icon={<GiftIcon className="text-emerald-600" />} />
      <MetricStatCard label="Usos Totales" value={uses} icon={<UsersIcon className="text-violet-600" />} />
      <MetricStatCard label="Promociones Vencidas" value={expired} icon={<CalendarDaysIcon className="text-rose-600" />} />
    </div>
  );
}
