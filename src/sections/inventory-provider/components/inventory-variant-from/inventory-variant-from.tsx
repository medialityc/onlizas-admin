"use client";
import {
  RHFCheckbox,
  RHFInputWithLabel,
  RHFSwitch,
  RHFSelectWithLabel,
} from "@/components/react-hook-form";
import { Separator } from "@/components/ui/separator";
import React, { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import InventoryProviderDetailSection from "../inventory-provider-detail-section/inventory-provider-detail-section";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getMyZones, getOnlizasZones } from "@/services/zones";
import { usePermissions } from "@/hooks/use-permissions";
import {
  getSupplierApprovalProcess,
  getSupplierApprovalProcessById,
} from "@/services/supplier";

type Props = {
  variantIndex: number;
  isPacking: boolean;
  supplierId?: string;
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

const InventoryVariantFrom = ({
  variantIndex,
  isPacking,
  supplierId,
}: Props) => {
  const { watch, control, setValue } = useFormContext<ProductVariant>();
  const { hasSpecificPermission, isLoading: permissionsLoading } =
    usePermissions();

  const [isWarranty, isLimit, id, deliveryMode] = watch([
    "warranty.isWarranty",
    "isLimit",
    "id",
    "deliveryMode",
  ]);

  // Verificar si el usuario tiene permisos de administrador
  // Por defecto asumir que es proveedor hasta que carguen los permisos
  const isAdmin =
    !permissionsLoading &&
    hasSpecificPermission("inventory_providers.create.admin");

  // Opciones de modo de entrega según el rol
  const deliveryModeOptions = useMemo(() => {
    if (isAdmin) {
      // Admin solo puede gestionar entregas por Onlizas
      return [{ value: "ONLIZAS", label: "Entrega gestionada por Onlizas" }];
    }
    // Proveedor puede elegir entre ambas opciones
    return [
      { value: "ONLIZAS", label: "Entrega gestionada por Onlizas" },
      { value: "PROVEEDOR", label: "Entrega gestionada por el Proveedor" },
    ];
  }, [isAdmin]);

  // Determina si usar zonas de plataforma (ONLIZAS) o del proveedor (PROVEEDOR)
  const isOnlizasDelivery = deliveryMode === "ONLIZAS";

  // Fetch zonas de Onlizas (cuando es entrega gestionada por Onlizas)
  const { data: onlizasZonesData, isLoading: onlizasZonesLoading } = useQuery({
    queryKey: ["onlizas-zones-variant"],
    queryFn: async () => {
      const res = await getOnlizasZones();
      if (res.error) {
        throw new Error(res.message);
      }
      return res.data?.data || [];
    },
    enabled: isOnlizasDelivery && !!deliveryMode,
  });

  // Fetch zonas del proveedor (cuando es entrega gestionada por el proveedor)
  const { data: supplierZonesData, isLoading: supplierZonesLoading } = useQuery(
    {
      queryKey: ["my-zones-variant"],
      queryFn: async () => {
        const res = await getMyZones();
        if (res.error) {
          throw new Error(res.message);
        }
        return res.data?.data || [];
      },
      enabled: !isOnlizasDelivery && !!deliveryMode && !isAdmin,
    },
  );

  const zonesData = isOnlizasDelivery ? onlizasZonesData : supplierZonesData;
  const zonesLoading = isOnlizasDelivery
    ? onlizasZonesLoading
    : supplierZonesLoading;

  const zoneOptions = useMemo(() => {
    return (zonesData || []).map((z) => ({
      value: z.id,
      label: z.name
        ? `${z.name} - $${z.deliveryAmount.toFixed(2)}`
        : `${z.districtsIds.length} distrito(s) - $${z.deliveryAmount.toFixed(2)}`,
    }));
  }, [zonesData]);

  // Limpiar zonas seleccionadas cuando cambia el modo de entrega
  React.useEffect(() => {
    setValue("zoneIds", []);
    setValue("zones", []);
  }, [deliveryMode, setValue]);

  // Si es admin, establecer automáticamente el modo de entrega a ONLIZAS
  React.useEffect(() => {
    if (isAdmin && !deliveryMode) {
      setValue("deliveryMode", "ONLIZAS");
    }
  }, [isAdmin, deliveryMode, setValue]);

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

      {/* Sección Zonas de Entrega */}
      {deliveryMode && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">Zonas de Entrega</p>
          <Controller
            name="zoneIds"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MultiSelect
                label={
                  isOnlizasDelivery
                    ? "Zonas de entrega de la plataforma"
                    : "Mis zonas de entrega"
                }
                placeholder={zonesLoading ? "Cargando..." : "Seleccione zonas"}
                data={zoneOptions}
                value={field.value || []}
                onChange={(selectedIds) => {
                  field.onChange(selectedIds);
                  // Guardar también los objetos completos de las zonas seleccionadas
                  const selectedZones = (zonesData || []).filter((zone) =>
                    selectedIds.includes(zone.id),
                  );
                  setValue("zones", selectedZones);
                }}
                searchable
                clearable
                error={error?.message}
                disabled={zonesLoading}
                classNames={{
                  input: "form-input",
                  label:
                    "text-sm font-semibold text-gray-900 dark:text-gray-300",
                }}
                maxDropdownHeight={200}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            {isOnlizasDelivery
              ? "Las zonas de la plataforma definen dónde Onlizas puede entregar este producto."
              : "Tus zonas definen los distritos donde puedes entregar este producto y el costo de envío."}
          </p>
        </div>
      )}

      <Separator className="my-2" />

      {/* Imágenes */}
      <RHFMultiImageUpload name={"images"} label="Imágenes de producto" />
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
          <PrecioNetoDisplay supplierId={supplierId} />
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
          className="form-checkbox h-4 w-4 text-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-primary"
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
          className="form-checkbox h-4 w-4 text-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-primary"
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
              className="form-checkbox h-4 w-4 text-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded focus:ring-primary"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryVariantFrom;

// Componente auxiliar dentro del mismo archivo para mostrar precios netos con estilos según margen
type PrecioNetoDisplayProps = {
  supplierId?: string;
};

const PrecioNetoDisplay = ({ supplierId }: PrecioNetoDisplayProps) => {
  const { watch } = useFormContext<ProductVariant>();
  const [price, costPrice] = watch(["price", "costPrice"]);

  const { hasSpecificPermission, isLoading: permissionsLoading } =
    usePermissions();
  const isAdmin =
    !permissionsLoading &&
    hasSpecificPermission("inventory_providers.create.admin");

  const { data: fixedTax, isLoading: fixedTaxLoading } = useQuery({
    queryKey: ["supplier-fixed-tax", isAdmin ? (supplierId ?? null) : "me"],
    queryFn: async () => {
      if (isAdmin) {
        if (!supplierId) return null;
        const res = await getSupplierApprovalProcessById(supplierId);
        if (res.error) {
          throw new Error(
            res.message || "Error al obtener datos del proveedor",
          );
        }
        return res.data?.fixedTax ?? null;
      }

      const res = await getSupplierApprovalProcess();
      if (res.error) {
        throw new Error(res.message || "Error al obtener datos del proveedor");
      }
      return res.data?.fixedTax ?? null;
    },
    enabled: !permissionsLoading && (!!supplierId || !isAdmin),
  });

  const effectiveFixedTax =
    typeof fixedTax === "number"
      ? fixedTax
      : fixedTax == null
        ? 15
        : Number(fixedTax) || 15;
  const commissionRate = effectiveFixedTax / 100;
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
        Descuento plataforma{" "}
        {fixedTaxLoading ? (
          "(cargando...)"
        ) : (
          <>({effectiveFixedTax.toFixed(2)}%): </>
        )}
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
              marginDisplay === "-" && "text-gray-500",
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
