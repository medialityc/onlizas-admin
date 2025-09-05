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
      <MetricStatCard label="Total Promociones" value={total} icon={<GiftIcon className="text-indigo-600" />} />
      <MetricStatCard label="Promociones Activas" value={active} icon={<GiftIcon className="text-emerald-600" />} />
      <MetricStatCard label="Usos Totales" value={uses} icon={<UsersIcon className="text-violet-600" />} />
      <MetricStatCard label="Promociones Vencidas" value={expired} icon={<CalendarDaysIcon className="text-rose-600" />} />
    </div>
  );
}
