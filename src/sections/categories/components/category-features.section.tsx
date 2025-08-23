import { Button } from "@/components/button/button";
import IconTrash from "@/components/icon/icon-trash";
import { RHFCheckbox, RHFInputWithLabel } from "@/components/react-hook-form";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const CategoryFeatureSection = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });
  return (
    <div>
      <label className="block font-semibold mb-2">Características</label>
      {fields.map((field, idx) => (
        <div key={field.id} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name={`features.${idx}.featureName`}
              label="Nombre de la característica"
              required
            />
            <RHFInputWithLabel
              name={`features.${idx}.featureDescription`}
              label="Descripción"
              required
            />
            {/* Sugerencias como array dinámico */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Sugerencias
              </label>
              <ArrayStringField
                name={`features.${idx}.suggestions`}
                index={idx}
              />
            </div>
          </div>
          {/* Opciones de característica */}
          <div className="flex flex-wrap gap-6 mt-4">
            <RHFCheckbox
              name={`features.${idx}.isPrimary`}
              label="¿Principal?"
            />
            <RHFCheckbox
              name={`features.${idx}.isRequired`}
              label="¿Obligatoria?"
            />
          </div>
          <div className="text-right mt-3">
            <IconButtonRemove onClick={() => remove(idx)} index={idx} />
          </div>
        </div>
      ))}
      <Button
        outline
        onClick={() =>
          append({
            featureName: "",
            featureDescription: "",
            suggestions: [],
            isPrimary: false,
            isRequired: false,
          })
        }
      >
        Agregar característica
      </Button>
    </div>
  );
};

export default CategoryFeatureSection;

function ArrayStringField({
  name,
  index = 0,
}: {
  name: string;
  index: number;
}) {
  const { control, formState } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ control, name });

  const _error = formState.errors as any;

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2 mb-2">
          <RHFInputWithLabel
            name={`${name}.${index}`}
            placeholder={`Sugerencia #${index + 1}`}
            autoFocus
          />

          <Button
            type="button"
            variant="danger"
            onClick={() => remove(index)}
            title="Eliminar sugerencia"
          >
            <IconTrash />
          </Button>
        </div>
      ))}

      {/* errors  */}
      {_error?.features?.[index]?.suggestions?.root?.message && (
        <span className="text-sm text-red-600">
          {_error?.features?.[index]?.suggestions?.root?.message}
        </span>
      )}

      {/* actions */}
      <Button outline onClick={() => append("")}>
        Agregar sugerencia
      </Button>
    </div>
  );
}

function IconButtonRemove({
  onClick,
  index,
}: {
  onClick: () => void;
  index: number;
}) {
  return (
    <Button
      className="flex flex-row gap-2 items-center"
      type="button"
      variant="danger"
      onClick={onClick}
      title="Eliminar"
      disabled={index === 0}
    >
      <IconTrash />
      Elimnar
    </Button>
  );
}
