"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use, useCallback } from "react";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { GetAllInventoryProviderResponse } from "@/services/inventory-providers";
import { InventoryProviderCardGrid } from "../components/inventory-provider-card-grid/inventory-provider-card-grid";
import { Button } from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { IUserProvider } from "@/types/users";

interface Props {
  inventories: Promise<ApiResponse<GetAllInventoryProviderResponse>>;
  query: SearchParams;
  provider: IUserProvider;
}

export default function InventoryProviderCardListContainer({
  inventories,
  query,
  provider,
}: Props) {
  const inventoriesResponse = use(inventories);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(inventoriesResponse);

  const { push } = useRouter();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  const handleCallBack = useCallback(() => {
    push("/dashboard/inventory");
  }, [push]);

  return (
    <div className="space-y-6">
      {inventoriesResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-start gap-2">
          <Button
            onClick={handleCallBack}
            className="bg-transparent hover:bg-gray-100 shadow-none text-black border-none"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Volver
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Inventario - <span className="font-bold"> {provider?.name}</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona el inventario del proveedor -{" "}
              <span className="font-bold"> {provider?.name}</span>
            </p>
          </div>
        </div>

        <InventoryProviderCardGrid
          data={inventoriesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          provider={provider}
        />
      </div>
    </div>
  );
}
