"use client";

import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";

import StoreVariant from "./store-variants";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  getAllWarehousesBySupplier,
  getAllWarehousesPhysical,
} from "@/services/warehouses";
import { StoreAccordion } from "../../store-accordion/store-accordion";

type Props = {
  title: string;
  index: number;
};

const StoreItem = ({ title, index }: Props) => {
  const { watch } = useFormContext();

  const providerId = watch("supplierId");

  return (
    <StoreAccordion title={title}>
      <div className="flex flex-col gap-4 rounded-lg mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RHFAutocompleteFetcherInfinity
              name={`storesWarehouses.${index}.warehousePhysicalIds`}
              label="Almacenes físicos"
              placeholder="Seleccionar almacenes físicos"
              onFetch={getAllWarehousesPhysical}
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="warehouses-physical"
              required
              multiple
            />
          </div>
          <div>
            <RHFAutocompleteFetcherInfinity
              name={`storesWarehouses.${index}.warehouseIds`}
              label="Almacenes del proveedor"
              placeholder="Seleccionar almacenes del proveedor"
              onFetch={(params) =>
                getAllWarehousesBySupplier(providerId, params)
              }
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="warehouses"
              required
              multiple
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* lista de variantes  */}
        <StoreVariant storeIndex={index} />
      </div>
    </StoreAccordion>
  );
};
export default StoreItem;
