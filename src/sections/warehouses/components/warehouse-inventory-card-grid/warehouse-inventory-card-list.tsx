import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import WarehouseInventoryCard from "./warehouse-inventory-card";
import { InventoryProvider } from "@/types/inventory";

type Props = {
  data?: InventoryProvider[];
  searchParams: SearchParams;
};
const WarehouseInventoryCardList = ({ data, searchParams }: Props) => {
  const id = useId();

  if (data?.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col justify-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams?.search
            ? "No se encontraron inventario que coincidan con tu búsqueda"
            : "No se encontraron inventario"}
        </div>
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 gap-4 mb-4">
      {data?.map((inventory: InventoryProvider) => (
        <div className="col-span-1" key={`${id}-${inventory?.id}`}>
          <WarehouseInventoryCard item={inventory} />
        </div>
      ))}
    </section>
  );
};

export default WarehouseInventoryCardList;
