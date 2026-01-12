"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllDepartments } from "@/types/departments";
import { DepartmentsList } from "./departments-list";

interface DepartmentsListPageProps {
  departmentsPromise: ApiResponse<GetAllDepartments>;
  query: SearchParams;
}

export default function DepartmentsListContainer({
  departmentsPromise,
  query,
}: DepartmentsListPageProps) {
  const departmentsResponse = departmentsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Departamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los departamentos del sistema y sus datos asociados
          </p>
        </div>
      </div>

      <DepartmentsList
        data={departmentsResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
