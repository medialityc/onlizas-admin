"use client";

import IconPlus from "@/components/icon/icon-plus";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { Button } from "@/components/button/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import IconTrash from "@/components/icon/icon-trash";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllCategories } from "@/services/categories";
import { ListBulletIcon } from "@heroicons/react/24/outline";

function ProductFeatureSection() {
  const { control } = useFormContext();
  const {
    fields: aboutFields,
    append: appendAbout,
    remove: removeAbout,
  } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ListBulletIcon className="mr-2 w-5 h-5" /> Características del
          producto
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendAbout({ value: "" })}
          disabled={aboutFields.length >= 10}
          className="flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Línea
        </Button>
      </div>

      <div className="space-y-3">
        {aboutFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4"
          >
            <div className="col-span-1">
              <RHFAutocompleteFetcherInfinity
                name={`features.${index}.categoryFeatureId`}
                label=""
                placeholder="Seleccionar categorías..."
                onFetch={getAllCategories}
                objectValueKey="id"
                objectKeyLabel="name"
                queryKey="categories"
                required
              />
            </div>
            <div className="col-span-1">
              <RHFInputWithLabel
                name={`features.${index}.featureName`}
                label=""
                placeholder={`Nombre ${index + 1}`}
              />
            </div>
            <div className="col-span-1 flex flex-row gap-2">
              <RHFInputWithLabel
                name={`features.${index}.value`}
                label=""
                placeholder={`Valor ${index + 1}`}
              />
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => removeAbout(index)}
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {aboutFields.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">Máximo 10 líneas.</div>
      )}
    </div>
  );
}

export default ProductFeatureSection;
