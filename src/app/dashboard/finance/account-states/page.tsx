import {
  getClosuresSummary,
  getSupplierFinancialSummary,
} from "@/services/finance/closures";
import ClosuresSummaryDashboard from "@/sections/finance/components/closures-summary-dashboard";
import { SupplierFinancialSummaryTable } from "@/sections/finance/components/supplier-financial-summary-table";
import { AccountStatesActions } from "@/sections/finance/components/account-states-actions";

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

  const rawStartDate = Array.isArray(startDateParam)
    ? startDateParam[0]
    : startDateParam;
  const rawEndDate = Array.isArray(endDateParam)
    ? endDateParam[0]
    : endDateParam;
  const closureTypeStr = Array.isArray(closureTypeParam)
    ? closureTypeParam[0]
    : closureTypeParam;
  const closureType = closureTypeStr ? Number(closureTypeStr) : undefined;

  // Si no vienen fechas en la URL, usar rango por defecto de 1 mes
  let startDate = rawStartDate;
  let endDate = rawEndDate;

  if (!startDate || !endDate) {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    startDate = formatDate(oneMonthAgo);
    endDate = formatDate(today);
  }

  const filters: {
    startDate?: string;
    endDate?: string;
    closureType?: number;
  } = {};

  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (typeof closureType === "number") filters.closureType = closureType;

  const [closuresRes, suppliersRes] = await Promise.all([
    getClosuresSummary(filters),
    getSupplierFinancialSummary({
      fromDate: `${startDate}T00:00:00Z`,
      toDate: `${endDate}T23:59:59Z`,
      pendingAccountsOnly: true,
    }),
  ]);

  if (closuresRes.error || !closuresRes.data) {
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
        <AccountStatesActions
          summary={closuresRes.data}
          suppliers={
            suppliersRes.error || !suppliersRes.data ? [] : suppliersRes.data
          }
          startDate={startDate}
          endDate={endDate}
          closureType={closureType}
        />
      </div>
      <ClosuresSummaryDashboard summary={closuresRes.data} />
      <SupplierFinancialSummaryTable
        items={
          suppliersRes.error || !suppliersRes.data ? [] : suppliersRes.data
        }
        emptyText={
          suppliersRes.error
            ? "No se pudo cargar la información de proveedores."
            : undefined
        }
      />
    </div>
  );
}
