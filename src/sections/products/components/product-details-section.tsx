"use client";

import IconClipboardText from "@/components/icon/icon-clipboard-text";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useMemo, useRef } from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { Button } from "@/components/button/button";
import IconTrash from "@/components/icon/icon-trash";

interface DetailEntry {
  key: string;
  value: string;
}

function ProductDetailsSection() {
  const { control, setValue, getValues, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detailsArray" as const,
  });

  const detailsArray: DetailEntry[] = watch("detailsArray");
  const lastSerializedRef = useRef<string>("__init__");

  useEffect(() => {
    const obj: Record<string, string> = {};
    for (const item of detailsArray) {
      const k = item?.key?.trim();
      if (k) obj[k] = item.value ?? "";
    }
    const serialized = JSON.stringify(obj);
    if (serialized === lastSerializedRef.current) {
      return;
    }
    const currentDetails = getValues("details") as
      | Record<string, string>
      | undefined;
    const currentSerialized = JSON.stringify(currentDetails || {});
    if (currentSerialized === serialized) {
      lastSerializedRef.current = serialized;
      return;
    }
    lastSerializedRef.current = serialized;
    setValue("details", obj, { shouldDirty: true, shouldTouch: false });
  }, [detailsArray, getValues, setValue]);

  const duplicateKeys = useMemo(() => {
    const counts: Record<string, number> = {};
    detailsArray.forEach((d) => {
      const k = d.key?.trim();
      if (!k) return;
      counts[k] = (counts[k] || 0) + 1;
    });
    return Object.keys(counts).filter((k) => counts[k] > 1);
  }, [detailsArray]);

  const addRow = () => {
    if (fields.length >= 50) return;
    append({ key: "", value: "" });
  };

  return (
    <div className="bg-blur-card">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
            <IconClipboardText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalles del Producto
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configura atributos personalizados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-full">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {fields.length}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              /50
            </span>
          </div>
          <Button
            type="button"
            onClick={addRow}
            disabled={fields.length >= 50}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm hover:shadow-md"
          >
            Agregar
          </Button>
        </div>
      </div>

      {/* Duplicate Keys Warning */}
      {duplicateKeys.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Claves duplicadas detectadas
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 ml-4">
            {duplicateKeys.join(", ")} - Asegúrate de que cada clave sea única
          </p>
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <IconClipboardText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              No hay detalles configurados
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {`Haz clic en "Agregar" para comenzar`}
            </p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div
              key={`${field.id}-${index}`}
              className="group p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50 hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 min-w-0">
                  <RHFInputWithLabel
                    label="Clave"
                    name={`detailsArray[${index}].key`}
                    placeholder="Ej: Color, Tamaño, Material..."
                    className="w-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <RHFInputWithLabel
                    label="Valor"
                    name={`detailsArray[${index}].value`}
                    placeholder="Ej: Azul, Grande, Algodón..."
                    className="w-full"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => remove(index)}
                    title="Eliminar detalle"
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      {fields.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Los detalles se guardarán como pares clave-valor en el objeto
            details
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsSection;
