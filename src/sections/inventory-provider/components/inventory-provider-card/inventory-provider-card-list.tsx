import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import { InventoryProvider } from "@/services/inventory-providers";
import InventoryProviderCard from "./inventory-provider-card";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  data?: InventoryProvider[];
  searchParams: SearchParams;
};
const InventoryProviderCardList = ({ data, searchParams }: Props) => {
  const id = useId();
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams
            ? "No se encontraron inventarios que coincidan con tu búsqueda"
            : "No se encontraron inventarios"}
        </div>
        {!searchParams && (
          <Button variant="primary">
            <Link href={"/dashboard/inventory/106/inventory/new"}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Crear un inventario
            </Link>
          </Button>
        )}
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((provider: InventoryProvider) => (
        <div className="col-span-1" key={`${id}-${provider?.id}`}>
          <InventoryProviderCard item={provider} />
        </div>
      ))}
    </section>
  );
};

export default InventoryProviderCardList;
