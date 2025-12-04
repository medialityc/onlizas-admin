import {
  getClosureAccounts,
  getClosureStatement,
} from "@/services/finance/closures";
import { ClosureAccountsCardsClient } from "@/sections/finance/list/closure-accounts-cards.client";

export default async function ClosureAccountsPage({
  params,
}: {
  params: { closureId: string };
}) {
  const closureId = params?.closureId as string;

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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Cuentas del cierre #{closureId}
        </h1>
        <p className="text-sm text-gray-500">
          Resumen y detalle de cuentas asociadas al cierre seleccionado.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const tone = c.tone ?? "gray";
          const ring = `ring-1 ring-${tone}-200`;
          const bg = `bg-gradient-to-br from-${tone}-50 to-white`;
          const text = `text-${tone}-700`;
          return (
            <div
              key={c.label}
              className={`rounded-xl ${ring} ${bg} p-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="text-xs text-gray-500">{c.label}</div>
              <div className={`text-xl font-semibold ${text}`}>
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
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Balances por proveedor</div>
            <div className="text-xs text-gray-500">
              {statement?.supplierBalances?.length ?? 0} proveedores
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b bg-gray-50">
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Proveedor
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Productos
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700">
                    Delivery
                  </th>
                  <th className="py-2 pr-4 font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {statement.supplierBalances.map((b: any) => (
                  <tr
                    key={b.supplierId}
                    className="border-b last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2 pr-4 text-gray-800">
                      {b.supplierName}
                    </td>
                    <td className="py-2 pr-4">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(b.productAmount ?? 0)}
                    </td>
                    <td className="py-2 pr-4">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(b.deliveryAmount ?? 0)}
                    </td>
                    <td className="py-2 pr-4 font-semibold">
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
        <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">
          No hay balances por proveedor para este cierre.
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Lista de cuentas</div>
          <div className="text-xs text-gray-500">
            {accountsResp?.accounts?.length ?? 0} cuentas
          </div>
        </div>
        {accountsResp?.accounts?.length ? (
          <ClosureAccountsCardsClient items={accountsResp?.accounts ?? []} />
        ) : (
          <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">
            No hay cuentas registradas en este cierre.
          </div>
        )}
      </div>
    </div>
  );
}
