"use client";
import React from "react";

type StatItem = {
  label: string;
  value: number | string;
  percent?: number; // 0..100
  color?: string;
  hint?: string;
};

function ProgressBar({
  value = 0,
  color = "#06b6d4",
}: {
  value?: number;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div
        className="h-full rounded"
        style={{
          width: `${v}%`,
          background: color,
          transition: "width 240ms ease",
        }}
      />
    </div>
  );
}

function StatCard({ item }: { item: StatItem }) {
  const color = item.color ?? "#4f46e5";
  return (
    <div className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 shadow-sm hover:shadow-md transition-shadow transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item.label}
          </div>
          <div
            className="mt-1 text-2xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${color}, #06b6d4)`,
            }}
          >
            {item.value}
          </div>
          {item.hint && (
            <div className="mt-1 text-xs text-gray-500">{item.hint}</div>
          )}
        </div>
        <span
          className="inline-block w-8 h-8 rounded-full"
          style={{ background: color, opacity: 0.15 }}
        />
      </div>
      {typeof item.percent === "number" && (
        <div className="mt-3">
          <ProgressBar value={item.percent} color={color} />
          <div className="mt-1 text-xs text-gray-500">
            {Math.round(item.percent)}%
          </div>
        </div>
      )}
    </div>
  );
}

export default function InteractiveSummary({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it, idx) => (
        <StatCard key={`${it.label}-${idx}`} item={it} />
      ))}
    </div>
  );
}

export function buildAdminSummary(d?: {
  totalUsers?: number;
  activeUsers?: number;
  totalProducts?: number;
  activeProducts?: number;
  totalOrders?: number;
  completedOrders?: number;
  totalStores?: number;
  activeStores?: number;
  totalReviews?: number;
  averageRating?: number;
  revenueThisMonth?: number;
}) {
  const items: StatItem[] = [
    {
      label: "Usuarios activos",
      value: d?.activeUsers ?? 0,
      percent: d?.totalUsers
        ? ((d.activeUsers ?? 0) / d.totalUsers) * 100
        : undefined,
      color: "#06b6d4",
    },
    {
      label: "Productos activos",
      value: d?.activeProducts ?? 0,
      percent: d?.totalProducts
        ? ((d.activeProducts ?? 0) / d.totalProducts) * 100
        : undefined,
      color: "#10b981",
    },
    {
      label: "Órdenes completadas",
      value: d?.completedOrders ?? 0,
      percent: d?.totalOrders
        ? ((d.completedOrders ?? 0) / d.totalOrders) * 100
        : undefined,
      color: "#4f46e5",
    },
    {
      label: "Tiendas activas",
      value: d?.activeStores ?? 0,
      percent: d?.totalStores
        ? ((d.activeStores ?? 0) / d.totalStores) * 100
        : undefined,
      color: "#f59e0b",
    },
  ];
  return items;
}

export function buildSupplierSummary(d?: {
  totalProducts?: number;
  activeProducts?: number;
  totalInventories?: number;
  activeInventories?: number;
  totalOrders?: number;
  completedOrders?: number;
  totalReviews?: number;
  reviewsThisMonth?: number;
}) {
  const items: StatItem[] = [
    {
      label: "Productos activos",
      value: d?.activeProducts ?? 0,
      percent: d?.totalProducts
        ? ((d.activeProducts ?? 0) / d.totalProducts) * 100
        : undefined,
      color: "#10b981",
    },
    {
      label: "Inventarios activos",
      value: d?.activeInventories ?? 0,
      percent: d?.totalInventories
        ? ((d.activeInventories ?? 0) / d.totalInventories) * 100
        : undefined,
      color: "#06b6d4",
    },
    {
      label: "Órdenes completadas",
      value: d?.completedOrders ?? 0,
      percent: d?.totalOrders
        ? ((d.completedOrders ?? 0) / d.totalOrders) * 100
        : undefined,
      color: "#4f46e5",
    },
    {
      label: "Reviews del mes",
      value: d?.reviewsThisMonth ?? 0,
      percent: d?.totalReviews
        ? ((d.reviewsThisMonth ?? 0) / d.totalReviews) * 100
        : undefined,
      color: "#f59e0b",
    },
  ];
  return items;
}
