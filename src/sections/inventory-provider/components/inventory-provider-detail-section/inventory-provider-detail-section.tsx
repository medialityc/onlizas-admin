import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import { AlertBox } from "@/components/alert/alert-box";
import IconClipboardText from "@/components/icon/icon-clipboard-text";
import IconTrash from "@/components/icon/icon-trash";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import Tippy from "@tippyjs/react";
import { getVariantConditionLabel } from "@/config/variant-condition-map";
import { DETAILS_MAX_ITEMS } from "@/utils/format";

const getWarrantyUnitLabel = (timeUnit?: number) => {
  switch (timeUnit) {
    case 0:
      return "días";
    case 2:
      return "año(s)";
    case 1:
    default:
      return "mes(es)";
  }
};

const InventoryProviderDetailSection = () => {
  const { control, watch, setValue, formState } = useFormContext();

  // Nuevas propiedades de variante que queremos mostrar en sección de detalles
  const [
    condition,
    isPrime,
    isActive,
    purchaseLimit,
    isLimit,
    warranty,
    volume,
    weight,
    packageDelivery,
  ] = watch([
    "condition",
    "isPrime",
    "isActive",
    "purchaseLimit",
    "isLimit",
    "warranty",
    "volume",
    "weight",
    "packageDelivery",
  ]);

  // Usamos mapa centralizado

  const detailName = `details`;

  const { fields, append, remove } = useFieldArray({
    control,
    name: detailName,
  });

  const watchedDetails = watch(detailName);

  if (!Array.isArray(watchedDetails)) {
    return null;
  }

  const mappedDetails = fields.map((field, index) => {
    const watched = watchedDetails?.[index] as any;
    const fallback = field as any;

    const key = String(watched?.key ?? fallback?.key ?? "");
    const featureName = watched?.featureName ?? fallback?.featureName ?? key;

    return {
      index,
      id: fallback?.id ?? `${key}-${index}`,
      key,
      featureName,
      featureDescription:
        watched?.featureDescription ?? fallback?.featureDescription,
      suggestions: watched?.suggestions ?? fallback?.suggestions ?? [],
      isRequired: watched?.isRequired === true || fallback?.isRequired === true,
      isFeature: watched?.isFeature === true || fallback?.isFeature === true,
    };
  });

  const featureDetails = mappedDetails.filter((detail) => detail.isFeature);
  const customDetails = mappedDetails.filter((detail) => !detail.isFeature);
  const isLimitReached = fields.length >= DETAILS_MAX_ITEMS;

  const addCustomDetail = () => {
    if (isLimitReached) return;

    append({
      key: "",
      value: "",
      isFeature: false,
    } as any);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
          <p className="font-bold text-sm dark:text-black-light">
            Características del Producto
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-full">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {fields.length}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              /{DETAILS_MAX_ITEMS}
            </span>
          </div>
        </div>

        {/* Bloque de propiedades nuevas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-black-light">
              Condición
            </span>
            <span className="text-sm font-medium dark:text-black-light">
              {getVariantConditionLabel(condition)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-black-light">
              Estado
            </span>
            <span className="text-sm font-medium dark:text-black-light">
              {isActive ? "Activa" : "Inactiva"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-black-light">
              Prime
            </span>
            <span className="text-sm font-medium dark:text-black-light">
              {isPrime ? "Sí" : "No"}
            </span>
          </div>
          {isLimit && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-black-light">
                Límite de compra
              </span>
              <span className="text-sm font-medium dark:text-black-light">
                {purchaseLimit || 0}
              </span>
            </div>
          )}
          {warranty?.isWarranty && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-black-light">
                Garantía
              </span>
              <span className="text-sm font-medium dark:text-black-light">
                {warranty.warrantyTime}{" "}
                {getWarrantyUnitLabel(warranty.timeUnit)} /{" "}
                {Number(warranty.warrantyPrice || 0) > 0
                  ? `$${warranty.warrantyPrice}`
                  : "GRATIS"}
              </span>
            </div>
          )}
          {packageDelivery && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-black-light">
                Paquetería
              </span>
              <span className="text-sm font-medium dark:text-black-light">
                {volume ? `${volume} vol` : "-"}{" "}
                {weight ? ` / ${weight} lb` : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {typeof formState?.errors?.details?.message === "string" && (
        <AlertBox
          message={formState.errors.details.message}
          title="Error en detalles"
          variant="danger"
        />
      )}

      {featureDetails.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featureDetails.map((feat) => {
            const inputPath = `${detailName}.${feat.index}.value`;
            const keyPath = `${detailName}.${feat.index}.key`;
            const currentValue = watch(inputPath) ?? "";

            return (
              <div className="col-span-1 flex flex-col gap-2" key={feat.id}>
                <div className="sr-only">
                  <RHFInputWithLabel
                    name={keyPath}
                    type="text"
                    label={feat.featureName}
                    readOnly
                  />
                </div>
                <RHFInputWithLabel
                  name={inputPath}
                  type="text"
                  label={
                    <div className="flex flex-row gap-1 items-center">
                      <p>{feat.featureName}</p>
                      {feat.featureDescription && (
                        <Tippy
                          trigger="mouseenter focus"
                          content={feat.featureDescription}
                        >
                          <InformationCircleIcon className="w-4 h-4 text-blue-500 cursor-help" />
                        </Tippy>
                      )}
                    </div>
                  }
                  placeholder={feat.featureDescription ?? feat.featureName}
                  required={feat.isRequired}
                />
                {feat.suggestions && feat.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {feat.suggestions.map((sugg: string, i: number) => {
                      const isSelected = currentValue === sugg;
                      return (
                        <button
                          key={i}
                          type="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setValue(inputPath, isSelected ? "" : sugg, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }
                          }}
                          onClick={() =>
                            setValue(inputPath, isSelected ? "" : sugg, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                          className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
                          }`}
                        >
                          {sugg}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-blur-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <IconClipboardText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Detalles adicionales
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Agrega pares clave-valor personalizados para esta variante
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={addCustomDetail}
            disabled={isLimitReached}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm hover:shadow-md"
          >
            Agregar
          </Button>
        </div>

        {customDetails.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No hay detalles adicionales configurados.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customDetails.map((detail) => (
              <div
                key={detail.id}
                className="group p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 min-w-0">
                    <RHFInputWithLabel
                      label="Clave"
                      name={`details.${detail.index}.key`}
                      placeholder="Ej: Color comercial, Acabado, Línea..."
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <RHFInputWithLabel
                      label="Valor"
                      name={`details.${detail.index}.value`}
                      placeholder="Ej: Azul marino, Mate, Premium..."
                      className="w-full"
                    />
                  </div>
                  <div className="shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(detail.index)}
                      title="Eliminar detalle"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLimitReached && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
            Alcanzaste el límite de {DETAILS_MAX_ITEMS} detalles entre
            características y adicionales.
          </p>
        )}
      </div>
    </div>
  );
};

export default InventoryProviderDetailSection;
