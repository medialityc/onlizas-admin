"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { GetAllDepartments } from "@/types/departments";
import { DepartmentsList } from "./departments-list";

interface DepartmentsListPageProps {
  departmentsPromise: Promise<ApiResponse<GetAllDepartments>>;
  query: SearchParams;
}

export default function DepartmentsListContainer({
  departmentsPromise,
  query,
}: DepartmentsListPageProps) {
  const departmentsResponse = use(departmentsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(departmentsResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {departmentsResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Departamentos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}
