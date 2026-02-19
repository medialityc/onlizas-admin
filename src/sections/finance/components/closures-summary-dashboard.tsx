"use client";
import { ClosuresSummary } from "@/types/finance";
import { formatCurrency } from "@/utils/format";

interface Props {
  summary: ClosuresSummary;
}

export default function ClosuresSummaryDashboard({ summary }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Estados de cuentas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Onlizas"
            value={formatCurrency(summary.platformFee)}
            bgColor="bg-gradient-to-br from-blue-50 to-blue-100/40"
            textColor="text-blue-700"
            ringColor="ring-blue-200"
          />
          <MetricCard
            label="Impuestos (7%)"
            value={formatCurrency(summary.taxes)}
            bgColor="bg-gradient-to-br from-purple-50 to-purple-100/40"
            textColor="text-purple-700"
            ringColor="ring-purple-200"
          />
          <MetricCard
            label="Proveedores"
            value={formatCurrency(summary.suppliersTotal)}
            bgColor="bg-gradient-to-br from-green-50 to-green-100/40"
            textColor="text-green-700"
            ringColor="ring-green-200"
          />
          <MetricCard
            label="Logística"
            value={formatCurrency(summary.logisticsTotal)}
            bgColor="bg-gradient-to-br from-orange-50 to-orange-100/40"
            textColor="text-orange-700"
            ringColor="ring-orange-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-4 shadow-sm ring-1 ring-gray-200/40 dark:bg-gray-800/60 dark:border-gray-700/60 dark:ring-gray-700/40">
          <h3 className="text-sm font-semibold mb-3">Resumen general</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total cierres</span>
              <span className="text-sm font-medium">
                {summary.totalClosures}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ingresos totales</span>
              <span className="text-sm font-medium">
                {formatCurrency(summary.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total cuentas</span>
              <span className="text-sm font-medium">
                {summary.totalAccounts}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-4 shadow-sm ring-1 ring-gray-200/40 dark:bg-gray-800/60 dark:border-gray-700/60 dark:ring-gray-700/40">
          <h3 className="text-sm font-semibold mb-3">Estado de cuentas</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pendientes</span>
              <span className="text-sm font-medium text-yellow-700">
                {summary.pendingAccounts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pagadas</span>
              <span className="text-sm font-medium text-green-700">
                {summary.paidAccounts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fallidas</span>
              <span className="text-sm font-medium text-red-700">
                {summary.failedAccounts}
              </span>
            </div>
          </div>
        </div>
      </div>

      {summary.latestClosure && (
        <div className="rounded-xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-4 shadow-sm ring-1 ring-gray-200/40 dark:bg-gray-800/60 dark:border-gray-700/60 dark:ring-gray-700/40">
          <h3 className="text-sm font-semibold mb-3">Último cierre</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-gray-500">Tipo</span>
              <p className="text-sm font-medium">
                {summary.latestClosure.typeName}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Fecha de corte</span>
              <p className="text-sm font-medium">
                {new Date(
                  summary.latestClosure.cutoffDate,
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Ingresos</span>
              <p className="text-sm font-medium">
                {formatCurrency(summary.latestClosure.totalIncome)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  bgColor,
  textColor,
  ringColor,
}: {
  label: string;
  value: string;
  bgColor?: string;
  textColor?: string;
  ringColor?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ring-1 ${bgColor || "bg-gray-50"} ${ringColor || "ring-gray-200"}`}
    >
      <div className={`text-sm font-medium ${textColor || "text-gray-700"}`}>
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
