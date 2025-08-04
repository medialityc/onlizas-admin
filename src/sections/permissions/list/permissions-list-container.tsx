"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllPermissionsResponse } from "@/types/permissions";
import { use } from "react";
import { PermissionList } from "./permissions-list";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";

interface PermissionListPageProps {
  permissionsPromise: Promise<ApiResponse<GetAllPermissionsResponse>>;
  query: SearchParams;
}

export default function PermissionListContainer({
  permissionsPromise,
  query,
}: PermissionListPageProps) {
  const permissionResponse = use(permissionsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(permissionResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {permissionResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Permisos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los permisos del sistema y sus permisos asociados
            </p>
          </div>
        </div>

        <PermissionList
          data={permissionResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
