"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import StatusBadge from "@/components/badge/status-badge";
import { Button } from "@/components/button/button";
import { EnvelopeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface EmailsSectionProps {
  emailFields: any[];
  errors: any;
  appendEmail: (email: { address: string; isVerified: boolean }) => void;
  handleRemoveEmail: (index: number) => void;
}

export function EmailsSection({
  emailFields,
  errors,
  appendEmail,
  handleRemoveEmail,
}: EmailsSectionProps) {
  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-96 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-sky-50 dark:bg-sky-900/10">
            <EnvelopeIcon className="h-5 w-5 text-sky-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Emails
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => appendEmail({ address: "", isVerified: false })}
          className="flex items-center gap-2 mr-9"
        >
          <PlusIcon className="h-4 w-4" />
          Añadir
        </Button>
      </div>

      <div className="h-80 divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto pr-2 ultra-thin-scrollbar flex-1">
        {errors.emails && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">
              ❌ Error en emails:{" "}
              {errors.emails.message || "Revise los campos de email"}
            </p>
          </div>
        )}
        {emailFields.map((field, index) => (
          <div key={field.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <RHFInputWithLabel
                  name={`emails.${index}.address`}
                  label={`Email ${index + 1}`}
                  className="flex-1"
                />
                {errors.emails?.[index]?.address && (
                  <p className="text-xs text-red-500 mt-1">
                    ❌ {errors.emails[index].address.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 mt-9">
                <StatusBadge
                  active={field.isVerified}
                  activeText="Verificado"
                  inactiveText="No Verificado"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveEmail(index)}
                  className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition"
                  aria-label={`Eliminar email ${index + 1}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {emailFields.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
            No hay emails añadidos.
          </div>
        )}
      </div>
    </div>
  );
}
