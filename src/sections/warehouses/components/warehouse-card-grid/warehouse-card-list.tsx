"use client";
import { SearchParams } from "@/types/fetch/request";
import React, { useCallback, useId } from "react";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WarehouseCard } from "./warehouse-card";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { useModalState } from "@/hooks/use-modal-state";
import { getWarehouseRoute } from "../../utils/warehouse";

type Props = {
  data?: WarehouseFormData[];
  searchParams: SearchParams;
  forceType?: WAREHOUSE_TYPE_ENUM;
};
const WarehouseCardList = ({ data, searchParams, forceType }: Props) => {
  const id = useId();

  const { openModal } = useModalState();
  const handleEditWarehouse = useCallback(
    (warehouse: WarehouseFormData) => {
      openModal<string>("edit", warehouse.id);
    },
    [openModal]
  );

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
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-4 mb-4">
      {data?.map((warehouse: WarehouseFormData) => (
        <div className="col-span-1" key={`${id}-${warehouse?.id}`}>
          <WarehouseCard
            warehouse={warehouse}
            route={
              forceType ||
              (warehouse.type?.toLocaleLowerCase() as WAREHOUSE_TYPE_ENUM)
            }
            onEdit={forceType && (() => handleEditWarehouse(warehouse))}
          />
        </div>
      ))}
    </section>
  );
};

export default WarehouseCardList;
