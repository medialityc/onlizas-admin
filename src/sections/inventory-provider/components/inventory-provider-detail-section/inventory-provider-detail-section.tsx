import { RHFInputWithLabel } from "@/components/react-hook-form";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type Props = {
  name: string;
};
const InventoryProviderDetailSection = ({ name }: Props) => {
  const { control } = useFormContext();

  const detailName = `${name}.details`;

  const { /* remove, */ fields } = useFieldArray({
    control,
    name: `${name}.details`,
  });

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
                name={`${detailName}.${detailIndex}.name`}
                type="text"
                label={feat?.featureName}
                placeholder={feat?.featureDescription ?? feat?.featureName}
                readOnly
              />
            </div>
            <div>
              <RHFInputWithLabel
                name={`${detailName}.${detailIndex}.value`}
                type="text"
                label={feat?.featureName}
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
