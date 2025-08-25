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

// Este componente maneja un array de pares key/value y genera el objeto "details" dinámico
function ProductDetailsSection() {
  const { control, setValue, getValues, watch } = useFormContext();

  // FieldArray para gestionar filas dinámicas
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
      return; // Sin cambios reales -> evitar setValue
    }
    const currentDetails = getValues("details") as
      | Record<string, string>
      | undefined;
    const currentSerialized = JSON.stringify(currentDetails || {});
    if (currentSerialized === serialized) {
      lastSerializedRef.current = serialized; // sincronizar cache
      return;
    }
    lastSerializedRef.current = serialized;
    setValue("details", obj, { shouldDirty: true, shouldTouch: false });
  }, [detailsArray, getValues, setValue]);

  // Detectar claves duplicadas para mostrar advertencia
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
  console.log(detailsArray);

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <IconClipboardText className="mr-2 w-5 h-5" /> Detalles del Producto
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{fields.length}/50</span>
          <button
            type="button"
            onClick={addRow}
            disabled={fields.length >= 50}
            className="btn btn-primary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Agrega pares clave/valor. La clave será usada como nombre del campo en
        el objeto enviado (FormData → details[clave]).
      </p>

      {duplicateKeys.length > 0 && (
        <div className="mb-3 text-xs text-red-600">
          Claves duplicadas: {duplicateKeys.join(", ")}. Ajusta las claves para
          que sean únicas.
        </div>
      )}

      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="text-sm text-gray-400 italic">Sin detalles aún.</div>
        )}
        {fields.map((field, index) => {
          return (
            <div
              key={`${field.id}-${index}`}
              className={`flex flex-col md:flex-row gap-2 items-end border rounded-md p-1 justify-start`}
            >
              <RHFInputWithLabel
                className="col-span-6"
                label="Clave"
                name={`detailsArray[${index}].key`}
                placeholder="Ej: Color"
              />
              <RHFInputWithLabel
                className="col-span-6"
                label="Valor"
                name={`detailsArray[${index}].value`}
                placeholder="Ej: Azul"
              />
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => remove(index)}
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductDetailsSection;
