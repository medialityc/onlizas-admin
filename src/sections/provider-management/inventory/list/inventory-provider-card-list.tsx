import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { InventoryProvider } from "@/types/inventory";
import ProviderCard from "./inventory-provider-card";

type Props = {
  data?: InventoryProvider[];
  searchParams: SearchParams;
  openModal: () => void;
};
const InventoryProviderCardList = ({
  data,
  searchParams,
  openModal,
}: Props) => {
  const id = useId();

  if (data?.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col justify-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams?.search
            ? "No se encontraron inventarios que coincidan con tu búsqueda"
            : "No se encontraron inventarios"}
        </div>
        {!searchParams?.search && (
          <Button variant="primary" className="mx-auto" onClick={openModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear un inventario
          </Button>
        )}
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((provider: InventoryProvider) => (
        <div className="col-span-1" key={`${id}-${provider?.id}`}>
          <ProviderCard item={provider} />
        </div>
      ))}
    </section>
  );
};

export default InventoryProviderCardList;
