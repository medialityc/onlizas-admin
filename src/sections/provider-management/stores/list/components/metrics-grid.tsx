"use client";

import { MetricCard } from "../../modals/components/metric-card";
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export type MetricsGridProps = {
  totalStores: number;
  totalVisits: number;
};

export function MetricsGrid({ totalStores, totalVisits }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        icon={<BuildingStorefrontIcon className="h-6 w-6 text-primary" />}
        label="Total Tiendas"
        value={totalStores}
      />
      <MetricCard
        icon={<EyeIcon className="w-4 h-4 text-primary" />}
        label="Visitas Mensuales"
        value={totalVisits?.toLocaleString() || 0}
      />

      <MetricCard
        icon={<ChartBarIcon className="h-6 w-6 text-primary" />}
        label="Total de Ventas"
        value="8000"
      />
      <MetricCard
        icon={<ArrowTrendingUpIcon className="h-6 w-6 text-primary" />}
        label="Total Ingresos"
        value="$ 20,000"
      />
    </div>
  );
}

export default MetricsGrid;
