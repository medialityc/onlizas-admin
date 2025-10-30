"use client";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { detailsObjectToArray } from "../../../../../utils/format";
import { Button } from "@/components/button/button";
import { ArrowRightLeft, XCircleIcon } from "lucide-react";
import Badge from "@/components/badge/badge";
import { WarehouseInventoryItem } from "./warehouse-inventory-item";
import {
  getAllWarehouseInventories,
  getAllWarehouses,
} from "@/services/warehouses";
import {
  Inventory,
  useWarehouseInventoryActions,
} from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";
import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";
import { InventoryProductItem } from "@/types/inventory";
import { useEffect } from "react";

// Componente principal del selector de productos
type Props = {
  warehouse: WarehouseFormData;
};

const WarehouseInventoryList = ({ warehouse }: Props) => {
  const warehouseId = warehouse?.id;
  const { addNewInventory, remove, inventories, resetStore } =
    useWarehouseInventoryActions();

  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const onOptionSelected = (option: any) => {
    const exist = inventories?.find((o) => o.id === option.id);
    if (exist) {
      // Si ya existe, solo lo eliminamos
      remove(exist?.id);
    } else {
      // Si no existe, lo agregamos
      addNewInventory({
        id: option?.id,
        parentProductName: option?.parentProductName,
        supplierName: option?.supplierName,
        totalStock: option?.totalStock,
        price: option?.price,
        products:
          option?.products?.map((product: InventoryProductItem) => ({
            id: product?.id,
            productName: product?.productName,
            details: detailsObjectToArray(product?.details),
            images: product?.images || [],
            stock: product?.stock || 0,
            count: 0,
            allowPartialFulfillment: false,
          })) || [],
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white items-start dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-[13px]">
            Almacén Actual
          </label>
          <div className="h-9 px-4 py-2 form-input">{warehouse?.name}</div>
        </div>

        <ArrowRightLeft className="w-5 h-5 mx-4  mt-10" />

        <div className="flex-1">
          <RHFAutocompleteFetcherInfinity
            name="destinationId"
            label="Almacén de Destino"
            placeholder="Selecciona el almacén destino..."
            onFetch={getAllWarehouses}
            exclude={[String(warehouseId)]}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="destination-warehouse"
            required
          />
        </div>
      </div>

      {/* inventories */}
      <div className="bg-white items-center dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-4">
        <RHFAutocompleteFetcherInfinity
          key={warehouseId}
          name="virtualTypeId"
          label="Inventario del almacén actual"
          placeholder="Seleccionar un inventario"
          extraFilters={{ id: warehouseId }}
          onFetch={(params) =>
            getAllWarehouseInventories(warehouseId as string, params)
          }
          objectValueKey="id"
          objectKeyLabel="parentProductName"
          queryKey="inventory-warehouse"
          multiple
          onOptionSelected={onOptionSelected}
          renderMultiplesValues={(selectedOptions, removeSelected) => (
            <div className="flex flex-row gap-2 flex-wrap">
              {selectedOptions.map((option: any) => (
                <Badge
                  className="dark:bg-slate-700 bg-slate-200 rounded-full text-gray-400 flex flex-row gap-2 p-1"
                  key={option.id}
                >
                  {option.parentProductName}
                  <Button
                    className="p-0 m-0 !bg-transparent border-0 [&>svg]:text-gray-400 [&>svg]:hover:text-gray-100"
                    onClick={() => {
                      removeSelected(option);
                      remove(option.id);
                    }}
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        />
      </div>

      {/* lista de inventarios */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {inventories?.map((inventory: Inventory) => (
          <div key={inventory.id}>
            <WarehouseInventoryItem inventory={inventory} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseInventoryList;
