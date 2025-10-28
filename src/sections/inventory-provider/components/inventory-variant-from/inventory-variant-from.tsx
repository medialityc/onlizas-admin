import { Button } from "@/components/button/button";
import {
  RHFCheckbox,
  RHFInputWithLabel,
  RHFSwitch,
} from "@/components/react-hook-form";
import { Separator } from "@/components/ui/separator";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { UseFieldArrayRemove, useFormContext } from "react-hook-form";
import InventoryProviderDetailSection from "../inventory-provider-detail-section/inventory-provider-detail-section";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  variantIndex: number;
  remove: UseFieldArrayRemove;
  isPacking: boolean;
};

const InventoryVariantFrom = ({ variantIndex, remove, isPacking }: Props) => {
  const { watch } = useFormContext<ProductVariant>();
  const [isWarranty, isLimit] = watch(["warranty.isWarranty", "isLimit"]);
  const { hasPermission } = usePermissions();
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);

  return (
    <div className="flex flex-col gap-2 mt-4 p-4 border dark:border-gray-600 border-dashed rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-row gap-2 items-center justify-between col-span-2 mb-5">
        <h3 className="font-bold">Variante {variantIndex + 1}</h3>
        {hasDeletePermission && (
          <Button
            onClick={() => remove()}
            className="bg-transparent rounded-full text-black p-0 border-0 shadow-none"
            iconOnly
          >
            <XMarkIcon className={"h-4 w-4 text-black"} />
          </Button>
        )}
      </div>

      {/* details section */}
      <InventoryProviderDetailSection />
      <Separator className="my-2" />

      {/* Imágenes */}
      <RHFMultiImageUpload name={`images`} label="Images de producto" />
      <Separator className="my-2" />

      {/* inventory info */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Información de Inventario</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <RHFInputWithLabel
              name="sku"
              label="SKU"
              type="text"
              placeholder="Ingrese SKU"
              required
            />
          </div>

          <div>
            <RHFInputWithLabel
              name="stock"
              label="Cantidad disponible"
              type="number"
              placeholder="0"
              min="0"
              step="0"
              required={isPacking}
            />
          </div>
          <div>
            <RHFInputWithLabel
              name="price"
              label="Precio de la variante"
              type="number"
              placeholder="0"
              min="0"
              required
              step="0.1"
            />
          </div>
          {isPacking && (
            <>
              <div>
                <RHFInputWithLabel
                  name="volume"
                  label="Volumen"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <RHFInputWithLabel
                  name="weight"
                  label="Peso (lb)"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  required
                  defaultValue={0}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección Restricciones y Límites */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Restricciones y Límites</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <RHFSwitch name={`isPrime`} label="Entrega express" />
          <RHFSwitch name={`isActive`} label="Variante Activa?" />
        </div>
      </div>

      <Separator className="my-2" />

      {/* Sección garantía */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Restricciones y Límites</p>

        <RHFCheckbox
          name={`isLimit`}
          label="Tiene límite de compras?"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLimit && (
            <RHFInputWithLabel
              name={`purchaseLimit`}
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
          name={`warranty.isWarranty`}
          label="Tiene garantía?"
          className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isWarranty && (
            <>
              <RHFInputWithLabel
                name={`warranty.warrantyTime`}
                label="Tiempo de garantía (meses)"
                type="number"
                placeholder="Ej: 12"
                min="0"
                step="0"
              />
              <RHFInputWithLabel
                name={`warranty.warrantyPrice`}
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

      {/* Sección productos por paquetería */}
      {!isPacking && (
        <>
          <Separator className="my-2" />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold">Producto por Paquetería</p>
            <RHFCheckbox
              name={`packageDelivery`}
              label="Habilitar entrega por paquetería"
              className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryVariantFrom;
