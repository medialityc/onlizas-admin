import {
  getClosureAccounts,
  getClosureStatement,
} from "@/services/finance/closures";
import { ClosureAccountsCardsClient } from "@/sections/finance/list/closure-accounts-cards.client";
import { formatDate } from "@/utils/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ClosureAccountsPage({
  params,
}: {
  params: Promise<{ closureId: string }>;
}) {
  const closureId = (await params)?.closureId as string;
  console.log(closureId);

  const [accRes, stmtRes] = await Promise.all([
    getClosureAccounts(closureId),
    getClosureStatement(closureId),
  ]);

  const accountsResp = accRes.data ?? {
    accounts: [],
    totalAccounts: 0,
    totalAmount: 0,
  };
  const statement = stmtRes.data ?? null;

  const cards = [
    {
      label: "Ingresos",
      value: statement?.totalIncome ?? 0,
      currency: true,
      tone: "emerald",
    },
    {
      label: "Tarifa Plataforma",
      value: statement?.platformFee ?? 0,
      currency: true,
      tone: "cyan",
    },
    {
      label: "Impuestos",
      value: statement?.taxes ?? 0,
      currency: true,
      tone: "orange",
    },
    {
      label: "Proveedores",
      value: statement?.suppliersTotal ?? 0,
      currency: true,
      tone: "indigo",
    },
    {
      label: "Logística",
      value: statement?.logisticsTotal ?? 0,
      currency: true,
      tone: "violet",
    },
    {
      label: "Total Cuentas",
      value: accountsResp?.totalAccounts ?? 0,
      tone: "gray",
    },
    {
      label: "Total a Pagar",
      value: accountsResp?.totalAmount ?? 0,
      currency: true,
      tone: "rose",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between">
        <nav
          className="text-sm text-gray-600 dark:text-gray-300"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center gap-1">
            <li>
              <Link
                href="/dashboard"
                className="hover:underline text-gray-700 dark:text-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/dashboard/finance"
                className="hover:underline text-gray-700 dark:text-gray-200"
              >
                Finanzas
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href="/dashboard/finance/closures"
                className="hover:underline text-gray-700 dark:text-gray-200"
              >
                Cierres
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-500 dark:text-gray-300">Cuentas</li>
          </ol>
        </nav>
        <Link
          href="/dashboard/finance/closures"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a cierres
        </Link>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Cuentas del cierre{" "}
          {statement
            ? `de ${formatDate(statement.fromDate)} a ${formatDate(statement.toDate)}`
            : ""}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Resumen y detalle de cuentas asociadas al cierre seleccionado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const tone = c.tone ?? "gray";
          const border = `border border-${tone}-200`;
          const bg = "bg-white";
          const text = `text-${tone}-700`;
          return (
            <div
              key={c.label}
              className={`rounded-xl ${border} ${bg} dark:border-gray-700 dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {c.label}
              </div>
              <div
                className={`text-xl font-semibold ${text} dark:text-gray-100`}
              >
                {c.currency
                  ? new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                    }).format(c.value ?? 0)
                  : (c.value ?? 0).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {statement?.supplierBalances?.length ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Balances por proveedor</div>
            <div className="text-xs text-gray-500">
              {statement?.supplierBalances?.length ?? 0} proveedores
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-b-gray-300 dark:border-b-gray-700 bg-gray-50 dark:bg-gray-800/60">
                  <th className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-200">
                    Proveedor
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-200">
                    Productos
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-200">
                    Delivery
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-200">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {statement.supplierBalances.map((b: any) => (
                  <tr
                    key={b.supplierId}
                    className="border-b last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {b.supplierName}
                    </td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(b.productAmount ?? 0)}
                    </td>
                    <td className="py-2 pr-4 text-gray-800 dark:text-gray-100">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(b.deliveryAmount ?? 0)}
                    </td>
                    <td className="py-2 pr-4 font-semibold text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(b.totalAmount ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm text-gray-500 dark:text-gray-400">
          No hay balances por proveedor para este cierre.
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Lista de cuentas</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {accountsResp?.accounts?.length ?? 0} cuentas
          </div>
        </div>
        {accountsResp?.accounts?.length ? (
          <ClosureAccountsCardsClient items={accountsResp?.accounts ?? []} />
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm text-gray-500 dark:text-gray-400">
            No hay cuentas registradas en este cierre.
          </div>
        )}
      </div>
    </div>
  );
}
