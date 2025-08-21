import React from "react";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllCategories } from "@/services/categories";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Category as CategoryType } from "@/types/categories";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UpdateSupplierFormData } from "./schema";

function SupplierCategories({
  state,
}: {
  state: "Pending" | "WaitingLogin" | "Approved" | "Rejected";
}) {
  const { control, getValues, setValue } =
    useFormContext<UpdateSupplierFormData>();

  const {
    fields: approvedFields,
    append: appendApproved,
    remove: removeApproved,
  } = useFieldArray({ control, name: "approvedCategories" });
  const {
    fields: pendingFields,
    append: appendPending,
    remove: removePending,
  } = useFieldArray({ control, name: "pendingCategories" });

  const approvedValues = getValues("approvedCategories") ?? [];
  const pendingValues = getValues("pendingCategories") ?? [];
  const existingIds = [
    ...approvedValues.map((c: { id: number }) => String(c.id)),
    ...pendingValues.map((c: { id: number }) => String(c.id)),
  ];

  return (
    <div className="space-y-6">
      {/* Autocomplete to add Approved Categories */}

      {/* Autocomplete to add Pending Categories */}
      <div className="space-y-2">
        <RHFAutocompleteFetcherInfinity<CategoryType>
          label="Agregar a categorías pendientes"
          name="__pendingCategoriesPicker"
          onFetch={getAllCategories}
          multiple
          exclude={existingIds}
          renderOption={(opt) => (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-medium">{opt.name}</span>
                {opt?.department?.name && (
                  <span className="text-xs text-gray-500">
                    Departamento: {opt.department.name}
                  </span>
                )}
              </div>
            </div>
          )}
          onOptionSelected={(opt) => {
            const currentApproved = getValues("approvedCategories") ?? [];
            const currentPending = getValues("pendingCategories") ?? [];
            const alreadyInApproved = currentApproved.some(
              (c: { id: number }) => c.id === (opt as any).id
            );
            const alreadyInPending = currentPending.some(
              (c: { id: number }) => c.id === (opt as any).id
            );
            if (!alreadyInApproved && !alreadyInPending) {
              appendPending({
                id: opt.id,
                name: opt.name,
              });
            }
            // Clear picker selection so it doesn't remain selected
            setValue("__pendingCategoriesPicker" as any, [], {
              shouldDirty: false,
              shouldValidate: false,
            });
          }}
          placeholder="Busca y selecciona categorías para dejar pendientes"
        />

        {/* Pending list visualization */}
        <div className="rounded-md border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold">
            Categorías pendientes
          </div>
          {pendingFields.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Sin categorías
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingFields.map((cat, index) => (
                <li
                  key={`${cat.id}-${index}`}
                  className="px-4 py-2 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{cat.name}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removePending(index);
                      // Ensure pickers have no lingering selections
                      setValue("__approvedCategoriesPicker" as any, [], {
                        shouldDirty: false,
                        shouldValidate: false,
                      });
                      setValue("__pendingCategoriesPicker" as any, [], {
                        shouldDirty: false,
                        shouldValidate: false,
                      });
                    }}
                    className="inline-flex items-center rounded-md border border-transparent bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 text-xs"
                    aria-label="Quitar categoría pendiente"
                    title="Quitar"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {state !== "Pending" && (
        <div className="space-y-2">
          <RHFAutocompleteFetcherInfinity<CategoryType>
            label="Agregar a categorías aprobadas"
            name="__approvedCategoriesPicker"
            onFetch={getAllCategories}
            multiple
            exclude={existingIds}
            renderOption={(opt) => (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{opt.name}</span>
                  {opt?.department?.name && (
                    <span className="text-xs text-gray-500">
                      Departamento: {opt.department.name}
                    </span>
                  )}
                </div>
              </div>
            )}
            onOptionSelected={(opt) => {
              const currentApproved = getValues("approvedCategories") ?? [];
              const currentPending = getValues("pendingCategories") ?? [];
              const alreadyInApproved = currentApproved.some(
                (c: { id: number }) => c.id === (opt as any).id
              );
              const alreadyInPending = currentPending.some(
                (c: { id: number }) => c.id === (opt as any).id
              );
              if (!alreadyInApproved && !alreadyInPending) {
                appendApproved({
                  id: opt.id,
                  name: opt.name,
                });
              }
              setValue("__approvedCategoriesPicker" as any, [], {
                shouldDirty: false,
                shouldValidate: false,
              });
            }}
            placeholder="Busca y selecciona categorías para aprobar"
          />

          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold">
              Categorías aprobadas
            </div>
            {approvedFields.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Sin categorías
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {approvedFields.map((cat, index) => (
                  <li
                    key={`${cat.id}-${index}`}
                    className="px-4 py-2 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{cat.name}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeApproved(index);
                        // Ensure pickers have no lingering selections
                        setValue("__approvedCategoriesPicker" as any, [], {
                          shouldDirty: false,
                          shouldValidate: false,
                        });
                        setValue("__pendingCategoriesPicker" as any, [], {
                          shouldDirty: false,
                          shouldValidate: false,
                        });
                      }}
                      className="inline-flex items-center rounded-md border border-transparent bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 text-xs"
                      aria-label="Quitar categoría aprobada"
                      title="Quitar"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierCategories;
