"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllPermissionsResponse } from "@/types/permissions";
import { PermissionList } from "./permissions-list";

interface PermissionListPageProps {
  permissionsPromise: ApiResponse<GetAllPermissionsResponse>;
  query: SearchParams;
}

export default function PermissionListContainer({
  permissionsPromise,
  query,
}: PermissionListPageProps) {
  const permissionResponse = permissionsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
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
  );
}
