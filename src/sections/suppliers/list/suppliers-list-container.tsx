"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { SuppliersList } from "./suppliers-list";
import { GetAllSuppliers } from "@/types/suppliers";
import { NavigationTabs } from "@/components/tab/navigation-tabs";
import { suppliersTabs } from "../config/tabs";

interface SuppliersListPageProps {
  suppliersPromise: Promise<ApiResponse<GetAllSuppliers>>;
  query: SearchParams;
}

export default function SuppliersListContainer({
  suppliersPromise,
  query,
}: SuppliersListPageProps) {
  const suppliersResponse = use(suppliersPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(suppliersResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {suppliersResponse.status == 401 && <SessionExpiredAlert />}

      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Proveedores
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los proveedores del sistema y sus datos asociados
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs tabs={suppliersTabs} className="mb-6" />

        <SuppliersList
          data={suppliersResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
