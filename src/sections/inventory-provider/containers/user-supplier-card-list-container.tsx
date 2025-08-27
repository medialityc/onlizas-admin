"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { GetAllUsersResponse } from "@/types/users";
import { UserProviderCardGrid } from "../components/user-provider-card-grid/user-provider-card-grid";

interface InventoryProviderListPageProps {
  supplierUsers: ApiResponse<GetAllUsersResponse>;
  query: SearchParams;
}

export default function UserSupplierCardListContainer({
  supplierUsers,
  query,
}: InventoryProviderListPageProps) {
  const supplierUsersResponse = supplierUsers;
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(supplierUsersResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {supplierUsersResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Usuarios proveedores
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestionar inventario seleccionando el usuario proveedor
            </p>
          </div>
        </div>

        <UserProviderCardGrid
          data={supplierUsersResponse?.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
