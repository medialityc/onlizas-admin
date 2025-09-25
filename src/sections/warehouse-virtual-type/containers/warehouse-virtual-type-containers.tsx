"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { WarehouseVirtualTypeList } from "../components/warehouse-virtual-type-list";
import { GetAllWarehousesVirtualType } from "../interfaces/warehouse-virtual-type.interface";

interface CategoriesListPageProps {
  typesPromise: ApiResponse<GetAllWarehousesVirtualType>;
  query: SearchParams;
}

export default function WarehouseVirtualTypeContainer({
  typesPromise,
  query,
}: CategoriesListPageProps) {
  const warehouseTypesResponse = typesPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Tipo de almacenes virtuales
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra las tipos de almacenes virtuales
            </p>
          </div>
        </div>

        <WarehouseVirtualTypeList
          data={warehouseTypesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
