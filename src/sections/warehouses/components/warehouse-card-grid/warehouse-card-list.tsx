import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WarehouseCard } from "./warehouse-card";

type Props = {
  data?: WarehouseFormData[];
  searchParams: SearchParams;
};
const WarehouseCardList = ({ data, searchParams }: Props) => {
  const id = useId();

  if (data?.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col justify-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams?.search
            ? "No se encontraron almacenes que coincidan con tu búsqueda"
            : "No se encontraron almacenes"}
        </div>
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((warehouse: WarehouseFormData) => (
        <div className="col-span-1" key={`${id}-${warehouse?.id}`}>
          <WarehouseCard warehouse={warehouse} />
        </div>
      ))}
    </section>
  );
};

export default WarehouseCardList;
