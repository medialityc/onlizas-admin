"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { ProductList } from "../components/product-list";
import { GetAllProducts } from "@/types/products";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface ProductsListContainerProps {
  productsPromise: Promise<ApiResponse<GetAllProducts>>;
  query: SearchParams;
}

export default function ProductsListProviderContainer({
  productsPromise,
  query,
}: ProductsListContainerProps) {
  const productsResponse = use(productsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {/*       {productsResponse.status == 401 && <SessionExpiredAlert />}
       */}{" "}
      {/* Static summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-sky-50 dark:bg-sky-900/10">
            <CubeIcon className="h-8 w-8 text-sky-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Productos</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              156
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/10">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Productos Activos</div>
            <div className="text-3xl font-extrabold text-green-600">142</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800/20">
            <ArchiveBoxIcon className="h-8 w-8 text-gray-700" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Stock Total</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              2,847
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
          <div className="p-2 rounded-full bg-yellow-50 dark:bg-yellow-900/10">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Valor Inventario</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
              $284,750
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Productos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los productos del sistema y sus datos asociados
            </p>
          </div>
        </div>

        <ProductList
          data={productsResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
