"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import StatusBadge from "@/components/badge/status-badge";
import { Button } from "@/components/button/button";
import { PhoneIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PhonesSectionProps {
  phoneFields: any[];
  errors: any;
  appendPhone: (phone: {
    countryId: number;
    number: string;
    isVerified: boolean;
  }) => void;
  handleRemovePhone: (index: number) => void;
}

export function PhonesSection({
  phoneFields,
  errors,
  appendPhone,
  handleRemovePhone,
}: PhonesSectionProps) {
  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-96">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-900/10">
            <PhoneIcon className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Teléfonos
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            appendPhone({
              countryId: 40,
              number: "",
              isVerified: false,
            })
          }
          className="flex items-center gap-2 mr-9"
        >
          <PlusIcon className="h-4 w-4" />
          Añadir
        </Button>
      </div>
      <div className="h-80 divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto pr-2 ultra-thin-scrollbar">
        {errors.phones && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">
              ❌ Error en teléfonos:{" "}
              {errors.phones.message || "Revise los campos de teléfono"}
            </p>
          </div>
        )}
        {phoneFields.map((field, index) => (
          <div
            key={`phone-${field.id}-${index}`}
            className="py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <RHFInputWithLabel
                  name={`phones.${index}.number`}
                  label={`Teléfono ${index + 1}`}
                  className="flex-1"
                  type="tel"
                />
                {errors.phones?.[index]?.number && (
                  <p className="text-xs text-red-500 mt-1">
                    ❌ {errors.phones[index].number.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 mt-7">
                <StatusBadge
                  isActive={field?.isVerified ?? false}
                  activeText="Verificado"
                  inactiveText="No Verificado"
                />

                <button
                  type="button"
                  onClick={() => handleRemovePhone(index)}
                  className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition"
                  aria-label={`Eliminar teléfono ${index + 1}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {phoneFields.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
            No hay teléfonos añadidos.
          </div>
        )}
      </div>
    </div>
  );
}
