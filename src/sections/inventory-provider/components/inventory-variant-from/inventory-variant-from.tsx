import {
  RHFCheckbox,
  RHFInputWithLabel,
  RHFSwitch,
  RHFSelectWithLabel,
} from "@/components/react-hook-form";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useFormContext } from "react-hook-form";
import InventoryProviderDetailSection from "../inventory-provider-detail-section/inventory-provider-detail-section";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { cn } from "@/lib/utils";

type Props = {
  variantIndex: number;
  isPacking: boolean;
};

// Opciones de condición de variante (enum VariantCondition del backend)
const variantConditionOptions = [
  { value: 1, label: "Usado: como nuevo" },
  { value: 2, label: "Usado: muy bueno" },
  { value: 3, label: "Usado: buen estado" },
  { value: 4, label: "Usado: aceptable" },
  { value: 5, label: "Usado: tal cual" },
  { value: 6, label: "Nuevo" },
  { value: 7, label: "Reacondicionado" },
];

const deliveryModeOptions = [
  { value: "ONLIZAS", label: "Entrega gestionada por Onlizas" },
  { value: "PROVEEDOR", label: "Entrega gestionada por el Proveedor" },
];

const InventoryVariantFrom = ({ variantIndex, isPacking }: Props) => {
  const { watch } = useFormContext<ProductVariant>();
  const [isWarranty, isLimit, id] = watch([
    "warranty.isWarranty",
    "isLimit",
    "id",
  ]);

  return (
    <div className="flex flex-col gap-2  ">
      {/* details section */}
      <InventoryProviderDetailSection />
      <Separator className="my-2" />

      {/* Sección Entrega */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Entrega</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFSelectWithLabel
            name="deliveryMode"
            label="Modo de entrega"
            required
            options={deliveryModeOptions}
            placeholder="Seleccionar..."
            emptyOption="Seleccione modo"
            variant="custom"
          />
          {/* Si el proveedor entrega, mostrar recordatorio de logística */}
          <EntregaInfoHelper />
        </div>
      </div>

      <Separator className="my-2" />

      {/* Imágenes */}
      <RHFMultiImageUpload name={"images"} label="Images de producto" />
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
              name="upc"
              label="UPC"
              type="text"
              placeholder="Ingrese UPC"
              required
            />
          </div>
          <div>
            <RHFInputWithLabel
              name="ean"
              label="EAN"
              type="text"
              placeholder="Ingrese EAN"
              required
            />
          </div>

          <div>
            <RHFSelectWithLabel
              name="condition"
              label="Condición"
              required
              options={variantConditionOptions}
              placeholder="Seleccionar..."
              emptyOption="Seleccione condición"
              variant="custom"
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
          {/* Precio movido a sección de Precios */}
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

      {/* Sección Precios */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold">Precios</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RHFInputWithLabel
            name="costPrice"
            label="Precio de costo"
            type="number"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
          <RHFInputWithLabel
            name="price"
            label="Precio Final (venta)"
            type="number"
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
          <PrecioNetoDisplay />
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

// Componente auxiliar dentro del mismo archivo para mostrar precios netos con estilos según margen
const PrecioNetoDisplay = () => {
  const { watch } = useFormContext<ProductVariant>();
  const [price, costPrice] = watch(["price", "costPrice"]);
  const commissionRate = 0.15;
  const validPrice =
    typeof price === "number" ? price : parseFloat(price as any) || 0;
  const descuento = validPrice * commissionRate;
  const recibido = validPrice - descuento;

  const marginRaw =
    costPrice && costPrice > 0 ? (recibido - costPrice) / costPrice : 0;
  const marginPct = marginRaw * 100;

  let marginClass = "";
  let marginDisplay = "-";
  if (costPrice && costPrice > 0) {
    if (marginPct <= 0) {
      marginClass = "text-red-600 font-semibold";
      marginDisplay = "0";
    } else if (marginPct < 10) {
      marginClass = "text-yellow-600 font-semibold";
      marginDisplay = marginPct.toFixed(1);
    } else if (marginPct < 30) {
      marginClass = "text-green-600 font-semibold";
      marginDisplay = marginPct.toFixed(1);
    } else {
      marginClass = "text-green-700 font-bold";
      marginDisplay = marginPct.toFixed(1);
    }
  }

  const pillBg = () => {
    if (marginDisplay === "-") return "transparent";
    if (marginClass.includes("red")) return "#fee2e2"; // rojo claro
    if (marginClass.includes("yellow")) return "#fef9c3"; // amarillo claro
    if (marginClass.includes("green-700")) return "#dcfce7"; // verde fuerte
    if (marginClass.includes("green")) return "#e7f7ed"; // verde medio
    return "transparent";
  };

  return (
    <div className="flex flex-col gap-1 rounded-md border p-3 bg-muted/30">
      <p className="text-xs font-medium">Resumen</p>
      <p className="text-[11px] text-muted-foreground">
        Descuento plataforma (15%):{" "}
        <span className="font-semibold">{descuento.toFixed(2)}</span>
      </p>
      <p className="text-[11px] text-muted-foreground">
        Valor a recibir:{" "}
        <span className="font-semibold text-green-600">
          {recibido.toFixed(2)}
        </span>
      </p>
      {costPrice !== undefined && (
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          Margen sobre costo:
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] inline-flex items-center",
              marginClass,
              marginDisplay === "-" && "text-gray-500"
            )}
            style={{ backgroundColor: pillBg() }}
          >
            {marginDisplay === "-" ? "-" : `${marginDisplay}%`}
          </span>
        </p>
      )}
    </div>
  );
};

// Pequeño panel informativo según modo de entrega
const EntregaInfoHelper = () => {
  const { watch } = useFormContext<ProductVariant>();
  const deliveryMode = watch("deliveryMode");
  return (
    <div className="flex flex-col gap-1 rounded-md border p-3 bg-muted/30 text-[11px] text-muted-foreground">
      {deliveryMode === "PROVEEDOR" ? (
        <>
          <p className="font-medium text-foreground">
            Entrega por el Proveedor
          </p>
          <p>
            Asegúrate de cumplir tiempos y requisitos de embalaje. Onlizas
            notificará al cliente y tú gestionas el envío.
          </p>
        </>
      ) : (
        <>
          <p className="font-medium text-foreground">Entrega por Onlizas</p>
          <p>
            Onlizas coordina logística y última milla. Verifica volumen y peso
            para optimizar costos.
          </p>
        </>
      )}
    </div>
  );
};
