"use client";
import { useState } from "react";
import SimpleModal from "@/components/modal/modal";

export type ClosureAccountCard = {
  id: string;
  supplierId: string | null;
  supplierName: string | null;
  purpose?: number;
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

  const purposeMap: Record<
    NonNullable<ClosureAccountCard["purpose"]>,
    string
  > = {
    0: "Pago a proveedor",
    1: "Pago de débito",
    2: "Reembolso",
    3: "Comisión de plataforma",
    4: "Impuestos",
  };

  if (!items?.length) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm text-gray-600 dark:text-gray-400">
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
          const isConcept = it.purpose && it.purpose !== 0;
          // En modo claro: tarjeta blanca con borde gris suave.
          // En modo oscuro: fondo gris oscuro y borde gris-700.
          const border = "border border-gray-200";
          const bg = "bg-white";
          const text = `text-${statusTone}-700`;
          return (
            <button
              key={it.id}
              className={`text-left rounded-2xl ${border} ${bg} dark:border-gray-700 dark:bg-gray-900 p-4 shadow-sm transition hover:shadow-md focus:outline-none relative overflow-hidden`}
              onClick={() => setSelected(it)}
            >
              {/* Accent ribbon to differentiate concept vs proveedor */}
              <span
                className={`absolute top-0 left-0 h-1 w-full ${
                  isConcept ? "bg-blue-200" : `bg-${statusTone}-200`
                }`}
              />
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isConcept ? "Concepto" : "Proveedor"}
                  </div>
                  <div className="font-medium truncate max-w-[220px] text-gray-900 dark:text-gray-100">
                    {isConcept ? it.description : it.supplierName}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total
                  </div>
                  <div
                    className={`text-xl font-semibold ${text} dark:text-${statusTone}-200`}
                  >
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                    }).format(it.totalAmount ?? 0)}
                  </div>
                </div>
              </div>

              {/* Secondary line: description for proveedor or concept tag */}
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                {isConcept ? (
                  <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-200">
                    <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 grid place-items-center text-xs">
                      ★
                    </span>
                    <span className="font-medium">
                      {it.purpose && purposeMap[it.purpose]
                        ? purposeMap[it.purpose]
                        : "Cuenta de plataforma"}
                    </span>
                  </span>
                ) : (
                  it.description
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center rounded-full bg-${statusTone}-100 px-2 py-1 text-${statusTone}-800 dark:bg-gray-800/60 dark:text-gray-100`}
                >
                  Estado:{" "}
                  <span className="ml-1 font-medium">{it.statusName}</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800/60 px-2 py-1 text-gray-700 dark:text-gray-200">
                  Vence:{" "}
                  <span className="ml-1 font-medium">
                    {new Date(it.dueDate).toLocaleDateString()}
                  </span>
                </span>
                {typeof it.subOrdersCount === "number" &&
                it.subOrdersCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800/60 px-2 py-1 text-gray-700 dark:text-gray-200">
                    Subórdenes:{" "}
                    <span className="ml-1 font-medium">
                      {it.subOrdersCount}
                    </span>
                  </span>
                ) : null}
              </div>
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
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selected?.purpose && selected.purpose !== 0
                    ? "Concepto"
                    : "Proveedor"}
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {selected?.purpose && selected.purpose !== 0
                    ? selected.purpose
                      ? purposeMap[selected.purpose]
                      : "Cuenta de plataforma"
                    : selected.supplierName}
                </div>
              </div>
              <div className="text-right ml-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "USD",
                  }).format(selected.totalAmount ?? 0)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Descripción
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-100">
                {selected.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Estado
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {selected.statusName}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Vencimiento
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(selected.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/40">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Pago
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {selected.paymentDate
                    ? new Date(selected.paymentDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>

            {/* Mostrar desglose en el modal sólo si es cuenta de proveedor */}
            {selected.debitBreakdown && selected.purpose === 0 ? (
              <div>
                <div className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Detalle de débitos
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900/40">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Productos
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {selected.debitBreakdown.productAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" },
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900/40">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Delivery
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {selected.debitBreakdown.deliveryAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" },
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900/40">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Impuestos
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {selected.debitBreakdown.taxAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" },
                      )}
                    </div>
                  </div>
                  {/* <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">
                      Tarifa Plataforma
                    </div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.platformFeeAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div> */}
                  {/* <div className="rounded-lg ring-1 ring-gray-200 p-3 bg-white">
                    <div className="text-xs text-gray-500">Proveedor</div>
                    <div className="font-semibold">
                      {selected.debitBreakdown.supplierAmount?.toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </div>
                  </div> */}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </SimpleModal>
    </>
  );
}
