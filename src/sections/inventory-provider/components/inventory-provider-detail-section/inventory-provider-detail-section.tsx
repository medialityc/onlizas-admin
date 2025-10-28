import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import Badge from "@/components/badge/badge";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import Tippy from "@tippyjs/react";
import { Tooltip } from "@mantine/core";

const InventoryProviderDetailSection = () => {
  const { control, watch, setValue } = useFormContext();

  const detailName = `details`;

  const { fields } = useFieldArray({ control, name: detailName });

  const watchedDetails = watch(detailName);

  // Si es un array (fieldArray), usamos el render original
  if (Array.isArray(watchedDetails) && fields?.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-bold text-sm mb-2">Características del Producto</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields?.map((feat: any, detailIndex: number) => {
            const inputPath = `${detailName}.${detailIndex}.value`;
            const currentValue = watch(inputPath) ?? "";
            return (
              <div className="col-span-1" key={feat?.id || detailIndex}>
                <div className="sr-only">
                  <RHFInputWithLabel
                    name={`${detailName}.${detailIndex}.key`}
                    type="text"
                    label={feat?.featureName || feat?.key}
                    placeholder={feat?.featureDescription ?? feat?.featureName}
                    readOnly
                  />
                </div>
                <div className="flex flex-row">
                  <RHFInputWithLabel
                    name={`${detailName}.${detailIndex}.value`}
                    type="text"
                    label={
                      <div className="flex flex-row gap-1">
                        <p>{feat?.featureName || feat?.key}</p>
                        {feat?.suggestions &&
                          feat?.suggestions?.length !== 0 && (
                            <Tippy
                              trigger="mouseenter focus"
                              content={feat?.suggestions?.join(", ")}
                              className=""
                            >
                              <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                            </Tippy>
                          )}
                      </div>
                    }
                    placeholder={feat?.featureDescription ?? feat?.featureName}
                    required={
                      watchedDetails?.[detailIndex]?.isRequired === true
                    }
                  />
                  <div className="ml-2 self-center flex flex-col gap-1">
                    {feat?.featureDescription && (
                      <Badge className="text-xs">
                        {feat.featureDescription}
                      </Badge>
                    )}

                    {feat?.suggestions && feat?.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {feat.suggestions.map((sugg: string, i: number) => {
                          const isActive = currentValue === sugg;
                          return (
                            <button
                              key={i}
                              type="button"
                              tabIndex={0}
                              aria-pressed={isActive}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setValue(inputPath, sugg);
                                }
                              }}
                              onClick={() => setValue(inputPath, sugg)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                isActive
                                  ? "bg-blue-600 text-white dark:bg-blue-500"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {sugg}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Si es un objeto { key: value }, iteramos sus entradas
  if (watchedDetails && typeof watchedDetails === "object") {
    const entries = Object.entries(watchedDetails || {});
    if (entries.length === 0) return null;

    return (
      <div className="flex flex-col gap-2">
        <p className="font-bold text-sm mb-2">Características del Producto</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map(([key, value]) => {
            const isObj =
              value && typeof value === "object" && "value" in value;
            const inputName = isObj
              ? `${detailName}.${key}.value`
              : `${detailName}.${key}`;
            const placeholder = String(
              (isObj ? (value as any).value : value) ?? ""
            );
            const required = isObj ? (value as any).isRequired === true : false;
            console.log(value);

            return (
              <div className="col-span-1" key={key}>
                <div className="flex flex-row">
                  <RHFInputWithLabel
                    name={inputName}
                    type="text"
                    label={key}
                    placeholder={placeholder}
                    required={required}
                  />
                  <div className="ml-2 self-center flex flex-col gap-1">
                    {isObj && (value as any).featureDescription && (
                      <Tooltip
                        label={(value as any).featureDescription}
                        className="text-xs"
                      >
                        <InformationCircleIcon className="w-5 h-5 text-blue-500" />
                      </Tooltip>
                    )}

                    {isObj &&
                      (value as any).suggestions &&
                      (value as any).suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(value as any).suggestions.map(
                            (sugg: string, i: number) => {
                              const currentValueObj = watch(inputName) ?? "";
                              const isActive = currentValueObj === sugg;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  tabIndex={0}
                                  aria-pressed={isActive}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      setValue(inputName, sugg);
                                    }
                                  }}
                                  onClick={() => setValue(inputName, sugg)}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                    isActive
                                      ? "bg-blue-600 text-white dark:bg-blue-500"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {sugg}
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default InventoryProviderDetailSection;
