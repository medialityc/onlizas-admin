"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use, useCallback } from "react";

import { InventoryProviderCardGrid } from "../components/inventory-provider-card-grid/inventory-provider-card-grid";
import { Button } from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { IUser, IUserResponseMe } from "@/types/users";
import { GetAllInventoryProviderResponse } from "@/types/inventory";

interface Props {
  inventories: Promise<ApiResponse<GetAllInventoryProviderResponse>>;
  query: SearchParams;
  provider?: IUser | IUserResponseMe;
  showBackButton?: boolean;
}

export default function InventoryProviderCardListContainer({
  inventories,
  query,
  provider,
  showBackButton = true,
}: Props) {
  const inventoriesResponse = use(inventories);
  const { updateFiltersInUrl } = useFiltersUrl();
  const { push } = useRouter();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  const handleCallBack = useCallback(() => {
    push("/dashboard/inventory");
  }, [push]);

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-start gap-2">
          {showBackButton && (
            <Button
              onClick={handleCallBack}
              className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none text-black dark:text-white border-none"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Volver
            </Button>
          )}
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Inventario - <span className="font-bold"> {provider?.name}</span>
            </h2>
            {showBackButton ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestiona el inventario del proveedor -{" "}
                <span className="font-bold"> {provider?.name}</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestione el inventario de sus productos -{" "}
                <span className="font-bold"> {provider?.name}</span>
              </p>
            )}
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
