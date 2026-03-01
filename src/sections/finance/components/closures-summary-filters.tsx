"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface ClosuresSummaryFiltersProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultClosureType?: string;
}

export function ClosuresSummaryFilters({
  defaultStartDate,
  defaultEndDate,
  defaultClosureType,
}: ClosuresSummaryFiltersProps = {}) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const searchParams = useSearchParams();

  const { startDate, endDate, closureType } = useMemo(() => {
    const start = searchParams.get("startDate") ?? defaultStartDate ?? "";
    const end = searchParams.get("endDate") ?? defaultEndDate ?? "";
    const type = searchParams.get("closureType") ?? defaultClosureType ?? "";

    return {
      startDate: start,
      endDate: end,
      closureType: type,
    };
  }, [searchParams]);

  const handleChange = (
    field: "startDate" | "endDate" | "closureType",
    value: string,
  ) => {
    if (field === "closureType") {
      updateFiltersInUrl({ closureType: value ? Number(value) : undefined });
    } else if (field === "startDate") {
      updateFiltersInUrl({ startDate: value || undefined });
    } else if (field === "endDate") {
      updateFiltersInUrl({ endDate: value || undefined });
    }
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Fecha inicio
        </label>
        <input
          type="date"
          className="border rounded-md px-2 py-1 text-sm"
          defaultValue={startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Fecha fin
        </label>
        <input
          type="date"
          className="border rounded-md px-2 py-1 text-sm"
          defaultValue={endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Tipo de cierre
        </label>
        <select
          className="border rounded-md px-2 py-1 text-sm min-w-36"
          defaultValue={closureType || ""}
          onChange={(e) => handleChange("closureType", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="1">Total</option>
          <option value="2">Parcial</option>
        </select>
      </div>
    </div>
  );
}
