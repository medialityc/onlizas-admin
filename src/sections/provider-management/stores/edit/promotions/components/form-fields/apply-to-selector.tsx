import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import ProductMultiSelect from "./product-multi-select";
import CategorySpecificSelect from "./category-specific-select";
import { RadioGroup, RadioGroupItem } from "@/components/radio/radio-group";
import ProductSelect from "./product-multi-select";

type ApplyMode = "orders" | "products" | "categories";

interface ApplyToSelectorProps {
  name?: string;
  label?: string;
  storeId?: string;
}

export function ApplyToSelector({ name = "appliesTo", label = "Aplica a", storeId = "" }: ApplyToSelectorProps) {
  const { formState, setValue } = useFormContext();
  const error = (formState.errors as any)?.[name]?.message;

    return (
    <div className="space-y-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>

      <Controller
        name={name}
        control={(useFormContext() as any).control}
        defaultValue={"products"}
        render={({ field }) => (
          <>
            <RadioGroup value={field.value} onValueChange={(v) => {
              field.onChange(v);
              // clear fields when switching
              if (v !== "products") setValue("productVariantsIds", undefined);
              if (v !== "categories") setValue("promotionCategoriesDTOs", undefined);
            }}>
              <div className="space-y-3">
                {/* <div className="flex items-center gap-3">
                  <RadioGroupItem value="orders" />
                  <span className="text-sm">Pedidos</span>
                </div> */}

                <div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="products" />
                    <span className="text-sm">Productos específicos</span>
                  </div>
                  {field.value === "products" && (
                    <div className="mt-3">
                      <ProductSelect multiple={true} name="productVariantsIds" storeId={storeId} label="Productos incluidos" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="categories" />
                    <span className="text-sm">Categorías específicas</span>
                  </div>
                  {field.value === "categories" && (
                    <div className="mt-3">
                      <CategorySpecificSelect name="categoriesIds" storeId={storeId} label="Categorías incluidas" />
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </>
        )}
      />

  {error && <p className="text-xs text-red-600 mt-1">{String(error)}</p>}
    </div>
  );
}

export default ApplyToSelector;
