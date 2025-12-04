"use client";
import { useState } from "react";
import SimpleModal from "@/components/modal/modal";

export type ClosureAccountCard = {
  id: string;
  supplierName: string;
  description: string;
  totalAmount: number;
  statusName: string;
  dueDate: string;
  paymentDate: string | null;
  subOrdersCount?: number;
  debitBreakdown?: {
    productAmount: number;
    platformFeeAmount: number;
    supplierAmount: number;
    deliveryAmount: number;
    taxAmount: number;
    totalAmount: number;
  };
};

export function ClosureAccountsCardsClient({
  items,
}: {
  items: ClosureAccountCard[];
}) {
  const [selected, setSelected] = useState<ClosureAccountCard | null>(null);

  if (!items?.length) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
        No se encontraron cuentas
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const statusTone = (it.statusName || "").toLowerCase().includes("pag")
            ? "emerald"
            : (it.statusName || "").toLowerCase().includes("venc")
              ? "rose"
              : "indigo";
          const ring = `ring-1 ring-${statusTone}-200`;
          const bg = `bg-gradient-to-br from-${statusTone}-50 to-white`;
          const text = `text-${statusTone}-700`;
          return (
            <button
              key={it.id}
              className={`text-left rounded-2xl ${ring} ${bg} p-4 shadow-sm transition hover:shadow-md focus:outline-none`}
              onClick={() => setSelected(it)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-500">Proveedor</div>
                  <div className="font-medium truncate max-w-[220px]">
                    {it.supplierName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className={`text-xl font-semibold ${text}`}>
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                    }).format(it.totalAmount ?? 0)}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-700 line-clamp-3">
                {it.description}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center rounded-full bg-${statusTone}-100 px-2 py-1 text-${statusTone}-800`}
                >
                  Estado:{" "}
                  <span className="ml-1 font-medium">{it.statusName}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  Vence:{" "}
                  <span className="ml-1 font-medium">
                    {new Date(it.dueDate).toLocaleDateString()}
                  </span>
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  Pago:{" "}
                  <span className="ml-1 font-medium">
                    {it.paymentDate
                      ? new Date(it.paymentDate).toLocaleDateString()
                      : "—"}
                  </span>
                </span>
                {typeof it.subOrdersCount === "number" ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                    Subórdenes:{" "}
                    <span className="ml-1 font-medium">
                      {it.subOrdersCount}
                    </span>
                  </span>
                ) : null}
              </div>

              {it.debitBreakdown ? (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-white/60 ring-1 ring-gray-200 p-2">
                    <div className="text-gray-500">Productos</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(it.debitBreakdown.productAmount ?? 0)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/60 ring-1 ring-gray-200 p-2">
                    <div className="text-gray-500">Delivery</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(it.debitBreakdown.deliveryAmount ?? 0)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/60 ring-1 ring-gray-200 p-2">
                    <div className="text-gray-500">Impuestos</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(it.debitBreakdown.taxAmount ?? 0)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/60 ring-1 ring-gray-200 p-2">
                    <div className="text-gray-500">Tarifa Plataforma</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(it.debitBreakdown.platformFeeAmount ?? 0)}
                    </div>
                  </div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <SimpleModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Detalles de la cuenta` : undefined}
        className="max-w-xl"
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Proveedor</div>
                <div className="font-semibold">{selected.supplierName}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-semibold">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "USD",
                  }).format(selected.totalAmount ?? 0)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Descripción</div>
              <div className="text-sm">{selected.description}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Estado</div>
                <div className="font-semibold">{selected.statusName}</div>
              </div>
              <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Vencimiento</div>
                <div className="font-semibold">
                  {new Date(selected.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-gray-50">
                <div className="text-xs text-gray-500">Pago</div>
                <div className="font-semibold">
                  {selected.paymentDate
                    ? new Date(selected.paymentDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>

            {selected.debitBreakdown ? (
              <div>
                <div className="font-medium mb-2">Detalle de débitos</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">Productos</div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.productAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">Delivery</div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.deliveryAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">Impuestos</div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.taxAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">
                      Tarifa Plataforma
                    </div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.platformFeeAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">Proveedor</div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.supplierAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </SimpleModal>
    </>
  );
}
