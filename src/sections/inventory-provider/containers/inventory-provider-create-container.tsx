import React from "react";
import InventoryProviderForm from "../components/inventory-provider-form/inventory-provider-form";
import { IUserProvider } from "@/types/users";
import { ApiResponse } from "@/types/fetch/api";
import { Button } from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { GetAllStores, Store } from "@/types/stores";

type Props = {
  userProvider: ApiResponse<IUserProvider>;
  stores: ApiResponse<GetAllStores>;
};
const InventoryProviderCreateContainer = ({ userProvider, stores }: Props) => {
  const { data: provider } = userProvider;
  const { data: _stores } = stores;
  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-start gap-2">
        <Link href={`/dashboard/inventory/${provider?.id}/list`}>
          <Button className="bg-transparent hover:bg-gray-100 shadow-none text-black border-none">
            <ArrowLeftIcon className="w-5 h-5" /> Volver
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Crear Inventario -{" "}
            <span className="font-bold"> {provider?.name}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona el inventario del proveedor -{" "}
            <span className="font-bold"> {provider?.name}</span>
          </p>
        </div>
      </div>

      <InventoryProviderForm
        userProvider={provider}
        stores={_stores?.data as Store[]}
        initValue={{
          stores: [],
          productId: 0,
          supplierId: provider?.id as number,
          categoryFeatures: [],
        }}
      />
    </div>
  );
};

export default InventoryProviderCreateContainer;
