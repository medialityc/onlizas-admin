export type ClosureAccountCard = {
  id: string;
  supplierName: string;
  description: string;
  totalAmount: number;
  statusName: string;
  dueDate: string;
  paymentDate: string | null;
  subOrdersCount?: number;
};

export function ClosureAccountsCards({
  items,
}: {
  items: ClosureAccountCard[];
}) {
  if (!items?.length) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
        No se encontraron cuentas
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <div key={it.id} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500">Proveedor</div>
              <div className="font-medium">{it.supplierName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-semibold">
                {it.totalAmount?.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-700 line-clamp-3">
            {it.description}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-gray-500">Estado</div>
              <div className="font-medium">{it.statusName}</div>
            </div>
            <div>
              <div className="text-gray-500">Vence</div>
              <div className="font-medium">
                {new Date(it.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Pago</div>
              <div className="font-medium">
                {it.paymentDate
                  ? new Date(it.paymentDate).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>

          {typeof it.subOrdersCount === "number" ? (
            <div className="mt-2 text-xs text-gray-600">
              Subórdenes: {it.subOrdersCount}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
