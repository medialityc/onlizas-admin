import { getClosuresSummary } from "@/services/finance/closures";
import ClosuresSummaryDashboard from "@/sections/finance/components/closures-summary-dashboard";
import { ClosuresSummaryFilters } from "@/sections/finance/components/closures-summary-filters";

type PageSearchParams = {
  startDate?: string | string[];
  endDate?: string | string[];
  closureType?: string | string[];
};

export default async function FinanceAccountStatesPage({
  searchParams,
}: {
  searchParams?: Promise<PageSearchParams>;
}) {
  const params = await searchParams;
  const startDateParam = params?.startDate;
  const endDateParam = params?.endDate;
  const closureTypeParam = params?.closureType;

  const startDate = Array.isArray(startDateParam)
    ? startDateParam[0]
    : startDateParam;
  const endDate = Array.isArray(endDateParam) ? endDateParam[0] : endDateParam;
  const closureTypeStr = Array.isArray(closureTypeParam)
    ? closureTypeParam[0]
    : closureTypeParam;
  const closureType = closureTypeStr ? Number(closureTypeStr) : undefined;

  const filters: {
    startDate?: string;
    endDate?: string;
    closureType?: number;
  } = {};

  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (typeof closureType === "number") filters.closureType = closureType;

  const res = await getClosuresSummary(filters);

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
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Estados de cuentas</h1>
          <p className="text-sm text-gray-500">
            Filtra por rango de fechas y tipo de cierre.
          </p>
        </div>
        <ClosuresSummaryFilters />
      </div>
      <ClosuresSummaryDashboard summary={res.data} />
    </div>
  );
}
