export default function FinanceAccountStatesPage() {
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">Estados de cuentas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">Onlizas (15%)</div>
          <div className="text-2xl font-bold">$0</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">Impuestos (7%)</div>
          <div className="text-2xl font-bold">$0</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">Proveedores</div>
          <div className="text-2xl font-bold">$0</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-600">Logística</div>
          <div className="text-2xl font-bold">$0</div>
        </div>
      </div>
    </div>
  );
}
