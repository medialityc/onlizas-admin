"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllRolesResponse } from "@/types/roles";
import { use } from "react";
import { RoleList } from "./role-list";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";

interface RoleListPageProps {
  rolesPromise: Promise<ApiResponse<GetAllRolesResponse>>;
  query: SearchParams;
}

export default function RoleListContainer({
  rolesPromise,
  query,
}: RoleListPageProps) {
  const roleResponse = use(rolesPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

 useFetchError(roleResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {roleResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Roles
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los roles del sistema y sus permisos asociados
            </p>
          </div>
        </div>

        <RoleList
          data={roleResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
