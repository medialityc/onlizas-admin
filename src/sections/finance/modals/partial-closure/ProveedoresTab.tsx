"use client";
import React from "react";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { formatDate } from "@/utils/format";
import { Account, SelectedAccount, Supplier } from "./types";

function Amount({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded bg-white/60 ring-1 ring-gray-200 p-2">
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "USD",
        }).format(value ?? 0)}
      </div>
    </div>
  );
}

function AccountCard({
  acc,
  supplierId,
  selectedAccounts,
  toggleAccount,
}: {
  acc: Account;
  supplierId: string;
  selectedAccounts: SelectedAccount[];
  toggleAccount: (supplierId: string, accountId: string) => void;
}) {
  const checked = (selectedAccounts || []).some(
    (a) => a.accountId === acc.accountId && a.supplierId === supplierId
  );
  const due = acc.dueDate ? new Date(acc.dueDate) : undefined;
  const now = new Date();
  const isOverdue = !!due && due < now;
  const tone = isOverdue ? "rose" : "indigo";
  const isConcept = !acc.supplierId && !supplierId;

  return (
    <div
      className={`relative rounded-xl p-3 md:p-4 shadow-sm transition ${
        checked
          ? `ring-2 ring-${tone}-400 bg-${tone}-50`
          : isConcept
            ? `ring-1 ring-${tone}-200 bg-gradient-to-br from-gray-50 to-white`
            : `ring-1 ring-${tone}-200 bg-gradient-to-br from-${tone}-50 to-white`
      } hover:shadow-md overflow-hidden`}
    >
      <span
        className={`absolute top-0 left-0 h-1 w-full ${isConcept ? "bg-blue-200" : `bg-${tone}-200`}`}
      />
      <button
        aria-label={checked ? "Quitar selección" : "Seleccionar cuenta"}
        className={`absolute top-2 right-2 rounded-md p-1.5 shadow-sm border ${
          checked
            ? `bg-${tone}-600 text-white border-${tone}-700`
            : `bg-white/90 backdrop-blur text-gray-700 border-gray-200`
        } hover:shadow-md`}
        onClick={() => toggleAccount(supplierId, acc.accountId)}
      >
        <span className="flex items-center justify-center h-3 w-3">
          {checked ? "✓" : ""}
        </span>
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500">
            {acc.supplierId || supplierId ? "Descripción" : "Concepto"}
          </div>
          <div className="font-medium line-clamp-2 max-w-3xl">
            {acc.description}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full bg-${tone}-100 text-${tone}-800 px-2 py-1`}
            >
              {isOverdue ? "Vencida" : "Pendiente"}
            </span>
            {due && (
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-1">
                Vence:{" "}
                <span className="ml-1 font-medium">{formatDate(due)}</span>
              </span>
            )}
            {Array.isArray(acc.orderIds) && acc.orderIds.length > 0 ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-1">
                Órdenes:{" "}
                <span className="ml-1 font-medium">{acc.orderIds.length}</span>
              </span>
            ) : null}
            {typeof acc.subOrdersCount === "number" ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-1">
                Subórdenes:{" "}
                <span className="ml-1 font-medium">{acc.subOrdersCount}</span>
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-left">
          <div className="text-xs text-gray-500">Total</div>
          <div className="font-semibold">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
            }).format(acc.totalAmount ?? 0)}
          </div>
        </div>
      </div>

      {!isConcept && (
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <Amount label="Productos" value={acc.productAmount} />
          <Amount label="Delivery" value={acc.deliveryAmount} />
          <Amount label="Impuestos" value={acc.taxAmount} />
          <Amount label="Tarifa Plataforma" value={acc.platformFeeAmount} />
          <Amount label="Proveedor" value={acc.supplierAmount} />
          <Amount label="Total" value={acc.totalAmount} />
        </div>
      )}
    </div>
  );
}

function SupplierCard({
  supplier,
  selectedAccounts,
  toggleAccount,
  computeSupplierAmount,
}: {
  supplier: Supplier;
  selectedAccounts: SelectedAccount[];
  toggleAccount: (supplierId: string, accountId: string) => void;
  computeSupplierAmount: (supplier: Supplier) => number;
}) {
  return (
    <div className="border rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{supplier.userName}</p>
          {supplier.email && (
            <p className="text-xs text-gray-500">{supplier.email}</p>
          )}
        </div>
        <div className="text-right text-xs text-gray-600">
          {typeof supplier.totalPendingAccounts !== "undefined" && (
            <div>Cuenta(s) pendientes: {supplier.totalPendingAccounts}</div>
          )}
          {typeof supplier.totalPendingAmount !== "undefined" && (
            <div>Monte pendiente: {supplier.totalPendingAmount}</div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="grid gap-3 grid-cols-1">
          {supplier.accounts?.map((acc) => (
            <AccountCard
              key={acc.accountId}
              acc={acc}
              supplierId={supplier.userId}
              selectedAccounts={selectedAccounts}
              toggleAccount={toggleAccount}
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-700">Subtotal proveedor</span>
        <span className="font-medium">
          {computeSupplierAmount(supplier).toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
          })}
        </span>
      </div>
    </div>
  );
}

export function ProveedoresTab({
  suppliers,
  onFetch,
  selectedAccounts,
  toggleAccount,
  computeSupplierAmount,
}: {
  suppliers: Supplier[];
  onFetch: (params: any) => Promise<any>;
  selectedAccounts: SelectedAccount[];
  toggleAccount: (supplierId: string, accountId: string) => void;
  computeSupplierAmount: (supplier: Supplier) => number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <RHFAutocompleteFetcherInfinity
        onFetch={onFetch}
        name="suppliers"
        label="Proveedores"
        returnSelectedObject
        objectKeyLabel="userName"
        multiple
      />

      {(!suppliers || suppliers.length === 0) && (
        <div className="rounded-lg border bg-gray-50 p-3 text-xs text-gray-600">
          Selecciona uno o más proveedores para cargar las cuentas pendientes.
          Puedes filtrar por nombre y luego marcar las cuentas a incluir en el
          cierre parcial.
        </div>
      )}

      {suppliers && suppliers.length !== 0 && (
        <div className="mt-4 rounded-lg border bg-gray-50 p-3 text-xs text-gray-600">
          Esta sección muestra las cuentas pendientes por proveedor en el rango
          seleccionado. Selecciona las cuentas que desees incluir en el cierre
          parcial usando las casillas de la tabla. El resumen superior
          actualizará el total a pagar y el conteo de cuentas seleccionadas.
        </div>
      )}

      {Array.isArray(suppliers) && suppliers.length > 0 && (
        <div className="mt-1 flex-1 min-h-0">
          <h3 className="text-sm font-semibold mb-2">
            Cuentas por pagar seleccionables
          </h3>
          <div className="space-y-4 pr-2">
            {suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.userId}
                supplier={supplier}
                selectedAccounts={selectedAccounts}
                toggleAccount={toggleAccount}
                computeSupplierAmount={computeSupplierAmount}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
