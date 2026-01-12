"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllClosures } from "@/types/finance";
import { SupplierClosuresList } from "./supplier-closures-list";
import { FiltersBar } from "../components/filters-bar";
import { useState, useCallback, useMemo } from "react";
import showToast from "@/config/toast/toastConfig";
import { Button } from "@mantine/core";

interface SupplierClosuresListContainerProps {
  closuresPromise: ApiResponse<GetAllClosures>;
  query: SearchParams & Record<string, any>;
}

type ExtendedSearchParams = SearchParams & {
  fromDate?: string;
  toDate?: string;
};

export default function SupplierClosuresListContainer({
  closuresPromise,
  query,
}: SupplierClosuresListContainerProps) {
  const { updateFiltersInUrl } = useFiltersUrl();

  const [fromDate, setFromDate] = useState<string>(query.fromDate || "");
  const [toDate, setToDate] = useState<string>(query.toDate || "");

  const handleSearchParamsChange = useCallback(
    (params: ExtendedSearchParams) => {
      updateFiltersInUrl({
        ...query,
        ...params,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      } as ExtendedSearchParams);
    },
    [updateFiltersInUrl, query, fromDate, toDate]
  );

  const validateDateRange = useCallback(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate).getTime();
      const to = new Date(toDate).getTime();
      if (isNaN(from) || isNaN(to)) {
        showToast("Fechas inválidas", "error");
        return false;
      }
      if (from > to) {
        showToast("La fecha inicio no puede ser mayor a la fecha fin", "error");
        return false;
      }
    }
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      showToast("Seleccione ambas fechas para filtrar", "error");
      return false;
    }
    return true;
  }, [fromDate, toDate]);

  const handleFilterDates = useCallback(() => {
    if (!validateDateRange()) return;
    updateFiltersInUrl({
      ...query,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      page: 1,
    } as ExtendedSearchParams);
  }, [validateDateRange, updateFiltersInUrl, query, fromDate, toDate]);

  const closuresData = useMemo(() => closuresPromise.data, [closuresPromise]);
  const hasError = closuresPromise.error;

  return (
    <div className="space-y-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Mis Cierres
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Listado de cierres parciales y totales relacionados a mis cuentas
          </p>
        </div>
      </div>
      <FiltersBar>
        <div>
          <label className="text-sm">Fecha inicio</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="text-sm">Fecha fin</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <Button
          className="px-3 py-2 rounded bg-primary text-white"
          onClick={handleFilterDates}
        >
          Filtrar
        </Button>
      </FiltersBar>
      {hasError ? (
        <div className="p-4 text-sm text-red-600">
          No se pudieron cargar los cierres.
        </div>
      ) : (
        <SupplierClosuresList
          data={closuresData}
          searchParams={{ ...query, fromDate, toDate }}
          onSearchParamsChange={handleSearchParamsChange}
        />
      )}
    </div>
  );
}
