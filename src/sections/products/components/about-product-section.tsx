"use client";

import IconPlus from "@/components/icon/icon-plus";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { Button } from "@/components/button/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import IconTrash from "@/components/icon/icon-trash";
import IconInfoCircle from "@/components/icon/icon-info-circle";
import { AlertBox } from "@/components/alert/alert-box";

function AboutProductSection() {
  const { control, formState } = useFormContext();
  const {
    fields: aboutFields,
    append: appendAbout,
    remove: removeAbout,
  } = useFieldArray({
    control,
    name: "aboutThis",
  });

  return (
    <div className="bg-blur-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <IconInfoCircle className="mr-2 w-5 h-5" /> Acerca del Producto
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendAbout("")}
          disabled={aboutFields.length >= 10}
          className="flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Línea
        </Button>
      </div>

      <div className="space-y-3">
        {formState?.errors?.aboutThis?.root?.message && (
          <AlertBox
            variant="danger"
            message={formState.errors.aboutThis.root.message as string}
            title="Error"
          />
        )}
        {aboutFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1">
              <RHFInputWithLabel
                name={`aboutThis.${index}`}
                label=""
                placeholder={`Línea ${index + 1}`}
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => removeAbout(index)}
            >
              <IconTrash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      {aboutFields.length > 0 && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Máximo 10 líneas.
        </div>
      )}
    </div>
  );
}

export default AboutProductSection;
