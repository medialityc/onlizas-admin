"use client";
import { InventoryProductItem } from "@/services/inventory-providers";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { detailsObjectToArray } from "../../../../../utils/format";

import { Button } from "@/components/button/button";
import { XCircleIcon } from "lucide-react";
import Badge from "@/components/badge/badge";
import { WarehouseInventoryItem } from "./warehouse-inventory-item";
import { getAllWarehouseInventories } from "@/services/warehouses";
import {
  Inventory,
  useWarehouseInventoryActions,
} from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";

// Componente principal del selector de productos
type Props = {
  warehouseId: number;
};

const WarehouseInventoryList = ({ warehouseId }: Props) => {
  const { addNewInventory, remove, inventories } =
    useWarehouseInventoryActions();

  const onOptionSelected = (option: any) => {
    const exist = inventories?.find((o) => o.id === option.id);
    if (exist) {
      remove(exist?.id);
    }
    {
      addNewInventory({
        id: option?.id,
        parentProductName: option?.parentProductName,
        supplierName: option?.supplierName,
        totalQuantity: option?.totalQuantity,
        price: option?.price,
        products:
          option?.products?.map((product: InventoryProductItem) => ({
            id: product?.id,
            productName: product?.productName,
            details: detailsObjectToArray(product?.details),
            images: product?.images || [],
            quantity: product?.quantity || 0,
            count: 0,
          })) || [],
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div>
          <RHFAutocompleteFetcherInfinity
            name="virtualTypeId"
            label="Inventario del almacén actual"
            placeholder="Seleccionar un inventario"
            onFetch={(params) =>
              getAllWarehouseInventories(warehouseId, params)
            }
            objectValueKey="id"
            objectKeyLabel="parentProductName"
            queryKey="inventory-warehouse"
            multiple
            onOptionSelected={onOptionSelected}
            renderMultiplesValues={(selectedOptions, removeSelected) => (
              <div className="flex flex-row gap-2 flex-wrap">
                {selectedOptions.map((option) => (
                  <Badge
                    className="dark:bg-slate-700 bg-slate-200 rounded-full text-gray-400 flex flex-row gap-2 p-1"
                    key={option.id}
                  >
                    {option.parentProductName}
                    <Button
                      className="p-0 m-0 !bg-transparent border-0 [&>svg]:text-gray-400 [&>svg]:hover:text-gray-100"
                      onClick={() => {
                        removeSelected(option);
                        remove(option.id as number);
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
      </div>

      {/* lista de inventarios */}
      <div className="flex flex-col gap-2">
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
