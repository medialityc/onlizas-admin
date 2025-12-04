import { getClosuresSummary } from "@/services/finance/closures";
import ClosuresSummaryDashboard from "@/sections/finance/components/closures-summary-dashboard";

export default async function FinanceAccountStatesPage() {
  const res = await getClosuresSummary();

  if (res.error || !res.data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Estados de cuentas</h1>
        <p className="text-sm text-red-600">
          No se pudo cargar el resumen de cierres.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ClosuresSummaryDashboard summary={res.data} />
    </div>
  );
}
