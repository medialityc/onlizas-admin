"use client";
import { useState } from "react";
import SimpleModal from "@/components/modal/modal";

export type ClosureAccountCard = {
  id: string;
  supplierId: string | null;
  supplierName: string | null;
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
          const isConcept = !it.supplierId;
          const ring = `ring-1 ring-${statusTone}-200`;
          const bg = isConcept
            ? `bg-gradient-to-br from-gray-50 to-white`
            : `bg-gradient-to-br from-${statusTone}-50 to-white`;
          const text = `text-${statusTone}-700`;
          return (
            <button
              key={it.id}
              className={`text-left rounded-2xl ${ring} ${bg} p-4 shadow-sm transition hover:shadow-md focus:outline-none relative overflow-hidden`}
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
                  <div className="text-xs text-gray-500">
                    {it.supplierId ? "Proveedor" : "Concepto"}
                  </div>
                  <div className="font-medium truncate max-w-[220px]">
                    {it.supplierId ? it.supplierName : it.description}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className={`text-xl font-semibold ${text}`}>
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                    }).format(it.totalAmount ?? 0)}
                  </div>
                </div>
              </div>

              {/* Secondary line: description for proveedor or concept tag */}
              <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                {it.supplierId ? (
                  it.description
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 grid place-items-center text-xs">
                      ★
                    </span>
                    <span className="font-medium">Cuenta de plataforma</span>
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
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
                {!it.supplierId &&
                  it.debitBreakdown &&
                  (() => {
                    const breakdown = it.debitBreakdown;
                    const dominant = [
                      { label: "Comisión", value: breakdown.platformFeeAmount },
                      { label: "Impuestos", value: breakdown.taxAmount },
                      { label: "Productos", value: breakdown.productAmount },
                      { label: "Delivery", value: breakdown.deliveryAmount },
                    ].sort((a, b) => (b.value || 0) - (a.value || 0))[0];
                    return dominant.value ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                        {dominant.label}:{" "}
                        <span className="ml-1 font-medium">
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(dominant.value)}
                        </span>
                      </span>
                    ) : null;
                  })()}
                {typeof it.subOrdersCount === "number" &&
                it.subOrdersCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-gray-700">
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
                <div className="text-xs text-gray-500">
                  {selected.supplierId ? "Proveedor" : "Concepto"}
                </div>
                <div className="font-semibold">
                  {selected.supplierId
                    ? selected.supplierName
                    : "Cuenta de plataforma"}
                </div>
              </div>
              <div className="text-right ml-3">
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

            {/* Mostrar desglose en el modal sólo si es cuenta de proveedor */}
            {selected.debitBreakdown && selected.supplierId ? (
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
