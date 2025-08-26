import React, { useId } from "react";
import { Store } from "@/types/stores";
import { useFieldArray } from "react-hook-form";
import Checkbox from "@/components/checkbox/checkbox";
import { Label } from "@/components/label/label";
import { cn } from "@/lib/utils";
import LongText from "@/components/long-text/long-text";
import {
  ArchiveBoxIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import StoreList from "../store-item/store-list";
import { Button } from "@/components/button/button";
import Link from "next/link";

type Props = {
  stores: Store[];
  control: any;
  name?: string;
};

export default function StoresCheck({
  stores,
  control,
  name = "storesWarehouses",
}: Props) {
  const id = useId();
  const { append, fields, remove } = useFieldArray({
    control,
    name,
  });

  const handleCheckboxChange = (store: Store, checked: boolean) => {
    if (checked) {
      const existingIndex = fields.findIndex(
        (field: any) => field.storeId === store?.id
      );

      if (existingIndex === -1) {
        append({
          storeId: store?.id,
          storeName: store?.name, // only for name accordion
          productVariants: [],
          warehouseIds: [],
          warehousePhysicalIds: [],
        });
      }
    } else {
      const existingIndex = fields.findIndex(
        (field: any) => field.storeId === store?.id
      );

      if (existingIndex !== -1) {
        remove(existingIndex);
      }
    }
  };

  // Función para verificar si un store está seleccionado
  const isStoreSelected = (storeId: number): boolean => {
    return fields.some((field: any) => field.storeId === storeId);
  };

  if (!stores || stores?.length === 0) {
    return (
      <div className="flex flex-col p-4 rounded-lg bg-gray-50 justify-center items-center">
        <div className="p-4 bg-gray-100 rounded-full">
          <ArchiveBoxIcon className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-lg">El proveedor no tiene tiendas asociadas</h3>
        <p className="text-sm leading-tight">
          Crea o asocia una tienda al proveedor
        </p>
        <Link
          href={"/dashboard/warehouses?createWarehouse=true"}
          className="mt-4"
        >
          <Button>
            <PlusIcon className="w-4 h-4" />
            Crea una tienda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold mb-2 dark:text-white">
        Selecciona las tiendas
      </h2>

      <div className="grid xl:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-2 md:gap-4">
        {stores?.map((item) => {
          const isChecked = isStoreSelected(item.id);

          return (
            <div
              key={`${id}-${item.id}`}
              className={cn(
                "relative flex cursor-pointer flex-col gap-2 rounded-md border px-3 py-1 shadow-sm outline-none transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-700 ",
                isChecked
                  ? "border-primary/50 bg-primary/5"
                  : "border-input hover:border-primary/30"
              )}
            >
              <div className="flex justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary dark:text-white dark:bg-gray-600">
                  <ShoppingBagIcon
                    className={"h-4 w-4 transition-opacity "}
                    aria-hidden="true"
                  />
                </div>
                <Checkbox
                  id={`${id}-${item.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(item, checked as boolean)
                  }
                  className="order-1 after:absolute after:inset-0 z-10"
                />
              </div>
              <Label htmlFor={`${id}-${item.id}`} className="cursor-pointer dark:text-white">
                <LongText
                  className="font-semibold"
                  text={item.name}
                  lineClamp={1}
                  as="h3"
                />
              </Label>
            </div>
          );
        })}
      </div>

      {/* variant store list */}
      <StoreList items={fields as any} />
    </div>
  );
}
