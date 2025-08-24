import { RHFInputWithLabel } from "@/components/react-hook-form";
import { FeatureFormData } from "@/sections/categories/schemas/category-schema";
import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
};
const InventoryProviderDetailSection = ({ name }: Props) => {
  const { watch } = useFormContext();

  const detailName = `${name}.details`;

  const feature: FeatureFormData[] = watch("categoryFeature");

  if (feature?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-sm mb-2">Características del Producto</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {feature?.map((feat, detailIndex: number) => (
          <div className="col-span-1" key={feat?.featureId}>
            <div className="sr-only">
              <RHFInputWithLabel
                name={`${detailName}.details.${detailIndex}.name`}
                type="text"
                label={feat?.featureName}
                placeholder={feat?.featureDescription ?? feat?.featureName}
                readOnly
              />
            </div>
            <div>
              <RHFInputWithLabel
                name={`${detailName}.details.${detailIndex}.value`}
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
