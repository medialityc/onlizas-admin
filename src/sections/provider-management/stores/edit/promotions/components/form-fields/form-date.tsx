import { useFormContext, useFieldArray } from "react-hook-form";
import RHFDatePickerBanner from "@/components/react-hook-form/rhf-date-picker-banner";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * FormDate manages an array of simple dates (single-day activations) that the user can add/remove.
 * It exposes the field `simpleDates` as an array of ISO date strings.
 */
export default function FormDate({ name = "simpleDates" }: { name?: string }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar a medianoche

  return (
    <div className="space-y-0">
      <div className="flex items-start justify-between gap-1">
        <label className="mb-0 text-sm font-semibold  dark:text-gray-100 text-gray-900">
          Días específicos
        </label>
        <Button
          type="button"
          size="sm"
          className="ml-2"
          variant="secondary"
          onClick={() => append(today)}
        >
          <PlusIcon className="w-4 h-4" />
          <span className="sr-only">Agregar fecha</span>
        </Button>
      </div>

      <div className="space-y-0">
        {fields.length === 0 && (
          <div className="text-sm text-gray-500">
            No hay días específicos seleccionados
          </div>
        )}

        {fields.map((f, idx) => (
          <div key={f.id} className="flex items-start gap-2">
            <div className="space-y-0">
              <RHFDatePickerBanner name={`${name}.${idx}`} minDate={today} />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-center"
              onClick={() => remove(idx)}
            >
              <TrashIcon className="w-4 h-4 text-white-600" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
