"use client";

import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import StoreVariant from "./store-variants";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  getAllWarehousesBySupplier,
  getAllWarehousesPhysical,
} from "@/services/warehouses";
import { ChevronDownIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";

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
type StoreAccordionProps = ChildrenProps & {
  title: string;
};
const StoreAccordion = ({ children, title }: StoreAccordionProps) => {
  const [active, setActive] = useState(true);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`px-4 py-3 bg-gray-100 rounded-md w-full flex items-center justify-between dark:bg-slate-800`}
        onClick={() => setActive(!active)}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-white dark:bg-gray-600">
            <ShoppingBagIcon
              className={"h-4 w-4 transition-opacity "}
              aria-hidden="true"
            />
          </div>

          <h3 className="text-lg font-bold dark:text-white">{title}</h3>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <ChevronDownIcon
            className={cn("h-5 w-5  duration-150", active ? "rotate-180" : "")}
          />
        </div>
      </button>
      <AnimateHeight duration={300} height={active ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};
