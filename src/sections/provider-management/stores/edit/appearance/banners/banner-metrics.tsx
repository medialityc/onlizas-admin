"use client";

import React from "react";
import { EyeIcon, TvIcon, PlusIcon } from "@heroicons/react/24/outline";
import MetricStatCard from "../../components/metric-stat-card";

interface BannerMetricsProps {
  total: number;
  active: number;
  positions: number;
}

export default function BannerMetrics({ total, active, positions }: BannerMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricStatCard 
        label="Total Banners" 
        value={total} 
        icon={<PlusIcon className="text-indigo-600" />} 
      />
      <MetricStatCard 
        label="Banners Activos" 
        value={active} 
        icon={<EyeIcon className="text-emerald-600" />} 
      />
      <MetricStatCard 
        label="Posiciones" 
        value={positions} 
        icon={<TvIcon className="text-violet-600" />} 
      />
    </div>
  );
}
