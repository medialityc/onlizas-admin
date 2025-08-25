"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UserEditFormData, EmailFormData } from "../user-edit-schema";
import { Button } from "@/components/button/button";
import { EnvelopeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

export default function EmailSection() {
  const { control, watch } = useFormContext<UserEditFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });

  const emails = watch("emails");

  const addEmail = () => {
    append({
      address: "",
      isVerified: false,
    } as EmailFormData);
  };

  const removeEmail = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white-light">
            Emails
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          outline
          onClick={addEmail}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar Email
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <EnvelopeIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No hay emails agregados. Haz clic en "Agregar Email" para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <RHFInputWithLabel
                  name={`emails.${index}.address`}
                  label={`Email ${index + 1}`}
                  placeholder="usuario@ejemplo.com"
                  type="email"
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                {emails?.[index]?.isVerified && (
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
                  onClick={() => removeEmail(index)}
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
        <p className="text-sm text-gray-500 dark:text-white-light">
          Puedes agregar múltiples direcciones de email. El primer email será
          considerado como principal.
        </p>
      )}
    </div>
  );
}
