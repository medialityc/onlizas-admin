import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import Tippy from "@tippyjs/react";

const InventoryProviderDetailSection = () => {
  const { control, watch } = useFormContext();

  const detailName = `details`;

  const { fields } = useFieldArray({ control, name: detailName });

  const watchedDetails = watch(detailName);

  // Si es un array (fieldArray), usamos el render original
  if (Array.isArray(watchedDetails) && fields?.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-bold text-sm mb-2">Características del Producto</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields?.map((feat: any, detailIndex: number) => (
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
                      {feat?.suggestions && feat?.suggestions?.length !== 0 && (
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
                  required={watchedDetails?.[detailIndex]?.isRequired === true}
                />
              </div>
            </div>
          ))}
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
