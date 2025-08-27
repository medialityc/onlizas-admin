import { Button } from "@/components/button/button";
import {
  RHFCheckbox,
  RHFInputWithLabel,
  RHFSwitch,
} from "@/components/react-hook-form";
import { Separator } from "@/components/ui/separator";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useCallback } from "react";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import InventoryProviderDetailSection from "../inventory-provider-detail-section/inventory-provider-detail-section";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";

type Props = {
  variantIndex: number;
  remove: UseFieldArrayRemove;
  variantName: string;
};
const InventoryVariantFrom = ({ variantIndex, variantName, remove }: Props) => {
  const { watch } = useFormContext();

  const onRemoveVariant = useCallback(() => {
    remove(variantIndex);
  }, [variantIndex, remove]);

  const isWarranty = watch(`${variantName}.warranty.isWarranty`);
  const isLimit = watch(`${variantName}.isLimit`);

  return (
    <div className="flex flex-col gap-2 mt-4 p-4 border dark:border-gray-600 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-row gap-2 items-center justify-between col-span-2 mb-5">
        <h3 className="font-bold">Variante {variantIndex + 1}</h3>
        <Button
          onClick={onRemoveVariant}
          className="bg-transparent rounded-full text-black p-0 border-0 shadow-none"
          iconOnly
        >
          <XMarkIcon className={"h-4 w-4 text-black"} />
        </Button>
      </div>

      {/* details section */}
      <InventoryProviderDetailSection variantName={variantName} />
      <Separator className="my-2" />

      {/* Imágenes */}
      <RHFMultiImageUpload
        name={`${variantName}.images`}
        label="Images de producto"
      />
      <Separator className="my-2" />

      {/* inventory info */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Información de Inventario</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <RHFInputWithLabel
              name={`${variantName}.quantity`}
              label="Cantidad disponible"
              type="number"
              placeholder="0"
              min="0"
              step="0"
            />
          </div>
          <div>
            <RHFInputWithLabel
              name={`${variantName}.price`}
              label="Precio de la variante"
              type="number"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <RHFInputWithLabel
              name={`${variantName}.discountValue`}
              label="Descuento %"
              type="number"
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección Restricciones y Límites */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Restricciones y Límites</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <RHFSwitch name={`${variantName}.isPrime`} label="Entrega express" />
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección garantía */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Restricciones y Límites</p>

        <RHFCheckbox
          name={`${variantName}.isLimit`}
          label="Tiene límite de compras?"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLimit && (
            <RHFInputWithLabel
              name={`${variantName}.purchaseLimit`}
              label="Límite de compras por usuario"
              type="number"
              placeholder="0"
              min="0"
              step="0"
            />
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección garantía */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Garantía</p>

        <RHFCheckbox
          name={`${variantName}.warranty.isWarranty`}
          label="Tiene garantía?"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isWarranty && (
            <>
              <RHFInputWithLabel
                name={`${variantName}.warranty.warrantyTime`}
                label="Tiempo de garantía (meses)"
                type="number"
                placeholder="Ej: 12"
                min="0"
                step="0"
              />
              <RHFInputWithLabel
                name={`${variantName}.warranty.warrantyPrice`}
                label="Precio de la garantía"
                type="number"
                placeholder="Ej: 50"
                min="0"
                step="0"
              />
            </>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección productos por paquetería */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Producto por Paquetería</p>
        <RHFCheckbox
          name={`${variantName}.packageDelivery`}
          label="Habilitar entrega por paquetería"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
      </div>
    </div>
  );
};

export default InventoryVariantFrom;
