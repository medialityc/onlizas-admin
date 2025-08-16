"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UserEditFormData, PhoneFormData } from "../user-edit-schema";
import { Button } from "@/components/button/button";
import { PhoneIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";

export default function PhoneSection() {
  const { control, watch } = useFormContext<UserEditFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  const phones = watch("phones");

  const addPhone = () => {
    append({
      countryId: -1,
      number: "",
      isVerified: false,
    } as PhoneFormData);
  };

  const removePhone = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Teléfonos</h3>
        </div>
        <Button
          type="button"
          size="sm"
          outline
          onClick={addPhone}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar Teléfono
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <PhoneIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No hay teléfonos agregados. Haz clic en "Agregar Teléfono" para
            comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <RHFCountrySelect
                    name={`phones.${index}.countryId`}
                    variant="code"
                    inputClassname="bg-white"
                  />
                </div>

                <div className="flex-1">
                  <RHFInputWithLabel
                    name={`phones.${index}.number`}
                    label={`Teléfono ${index + 1}`}
                    placeholder="1234567890"
                    type="tel"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {phones?.[index]?.isVerified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Verificado</span>
                  </div>
                )}

                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  outline
                  onClick={() => removePhone(index)}
                  className="flex items-center gap-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <p className="text-sm text-gray-500">
          Puedes agregar múltiples números de teléfono. El primer teléfono será
          considerado como principal.
        </p>
      )}
    </div>
  );
}
