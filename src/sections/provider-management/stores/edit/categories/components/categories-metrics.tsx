"use client";

import React from "react";
import MetricStatCard from "../../components/metric-stat-card";
import { EyeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

type CategoriesMetricsProps = {
  total: number;
  active: number;
  products: number;
};

export default function CategoriesMetrics({ total, active, products }: CategoriesMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <MetricStatCard
        label="Total Categorías"
        value={total}
        icon={<ChartBarIcon className="w-6 h-6 text-indigo-500" />}
      />
      <MetricStatCard
        label="Categorías Activas"
        value={active}
        icon={<EyeIcon className="w-6 h-6 text-emerald-600" />}
      />
      <MetricStatCard
        label="Total Productos"
        value={products}
        icon={<ChartBarIcon className="w-6 h-6 text-violet-600" />}
      />
    </div>
  );
}
