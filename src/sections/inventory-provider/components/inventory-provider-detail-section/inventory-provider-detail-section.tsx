import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useFieldArray, useFormContext } from "react-hook-form";
import Tippy from "@tippyjs/react";

type Props = {
  variantName: string;
};
const InventoryProviderDetailSection = ({ variantName }: Props) => {
  const { control } = useFormContext();

  const detailName = `${variantName}.details`;

  const { fields } = useFieldArray({ control, name: detailName });

  if (fields?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-sm mb-2">Características del Producto</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fields?.map((feat: any, detailIndex: number) => (
          <div className="col-span-1" key={feat?.id}>
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
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryProviderDetailSection;
