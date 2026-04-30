"use client";
import { ClosuresSummary } from "@/types/finance";
import { formatCurrency } from "@/utils/format";
import {
  BanknotesIcon,
  ReceiptPercentIcon,
  TruckIcon,
  UsersIcon,
  ChartBarIcon,
  WalletIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

interface Props {
  summary: ClosuresSummary;
}

export default function ClosuresSummaryDashboard({ summary }: Props) {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Onlizas"
          value={formatCurrency(summary.platformFee, "USD")}
          icon={<BanknotesIcon className="h-5 w-5" />}
          gradient="from-rose-500 to-orange-400"
        />
        <MetricCard
          title="Impuestos (7%)"
          value={formatCurrency(summary.taxes, "USD")}
          icon={<ReceiptPercentIcon className="h-5 w-5" />}
          gradient="from-fuchsia-500 to-rose-400"
        />
        <MetricCard
          title="Proveedores"
          value={formatCurrency(summary.suppliersTotal, "USD")}
          icon={<UsersIcon className="h-5 w-5" />}
          gradient="from-amber-500 to-yellow-400"
        />
        <MetricCard
          title="Logística"
          value={formatCurrency(summary.logisticsTotal, "USD")}
          icon={<TruckIcon className="h-5 w-5" />}
          gradient="from-orange-600 to-red-400"
        />
      </div>

      {/* Segunda fila: totales y estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Ingresos totales"
          value={formatCurrency(summary.totalIncome, "USD")}
          icon={<ChartBarIcon className="h-5 w-5" />}
          gradient="from-orange-500 to-amber-400"
        />
        <MetricCard
          title="Total cierres"
          value={summary.totalClosures}
          subtitle={`${summary.totalAccounts} cuentas`}
          icon={<WalletIcon className="h-5 w-5" />}
          gradient="from-stone-500 to-orange-300"
        />
        <div className="grid grid-cols-3 gap-3">
          <MiniStatusCard
            label="Pendientes"
            value={summary.pendingAccounts}
            color="text-amber-600"
            bg="bg-amber-50 dark:bg-amber-900/20"
            icon={<ExclamationTriangleIcon className="h-4 w-4" />}
          />
          <MiniStatusCard
            label="Pagadas"
            value={summary.paidAccounts}
            color="text-emerald-600"
            bg="bg-emerald-50 dark:bg-emerald-900/20"
            icon={<CheckCircleIcon className="h-4 w-4" />}
          />
          <MiniStatusCard
            label="Fallidas"
            value={summary.failedAccounts}
            color="text-red-600"
            bg="bg-red-50 dark:bg-red-900/20"
            icon={<XCircleIcon className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Último cierre */}
      {summary.latestClosure && (
        <div className="p-4 bg-gradient-to-br from-white/80 to-gray-50/60 dark:from-gray-900/80 dark:to-gray-800/70 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Último cierre
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniClosureField
              label="Tipo"
              value={summary.latestClosure.typeName}
              icon={<TagIcon className="h-4 w-4" />}
            />
            <MiniClosureField
              label="Fecha de corte"
              value={new Date(summary.latestClosure.cutoffDate).toLocaleDateString()}
              icon={<CalendarIcon className="h-4 w-4" />}
            />
            <MiniClosureField
              label="Ingresos"
              value={formatCurrency(summary.latestClosure.totalIncome, "USD")}
              icon={<BanknotesIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient = "from-indigo-500 to-cyan-400",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient?: string;
}) {
  return (
    <div className="p-4 bg-gradient-to-br from-white/80 to-gray-50/60 dark:from-gray-900/80 dark:to-gray-800/70 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {title}
          </div>
          <div className="mt-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400">
            {value}
          </div>
          {subtitle && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </div>
          )}
        </div>
        <div className="ml-4 flex items-center">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-sm`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStatusCard({
  label,
  value,
  color,
  bg,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-white/80 to-gray-50/60 dark:from-gray-900/80 dark:to-gray-800/70 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`p-2 rounded-full ${bg} ${color} mb-1`}>{icon}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

function MiniClosureField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/60 dark:bg-gray-800/40">
      <div className="p-2 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">
        {icon}
      </div>
      <div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {value}
        </div>
      </div>
    </div>
  );
}
