"use client";

import React from "react";
import { Store } from "@/types/stores";
import { FormProvider } from "@/components/react-hook-form";
import LoaderButton from "@/components/loaders/loader-button";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import AppearanceTabs from "./appearance-tabs";
import { useAppearanceSave } from "./hooks/use-appearance-save";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  store: Store;
}

export default function AppearanceContainer({ store }: Props) {
  const { methods, onSubmit, isLoading, isDirty } = useAppearanceSave({
    store,
  });
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  return (
    <FormProvider id="appearance-form" methods={methods} onSubmit={onSubmit}>
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
          <div className="mb-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Apariencia
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tema, colores y banners para: {store?.name}
            </p>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 min-h-16">
            <AppearanceTabs />
          </div>

          {/* Botón de guardar para toda la apariencia */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 -mx-5 px-5 py-4 mt-6">
            {hasUpdatePermission && (
              <LoaderButton
                form="appearance-form"
                type="submit"
                loading={isLoading}
                disabled={!isDirty}
                className="btn btn-primary btn-md shadow-sm"
              >
                <span className="inline-flex items-center gap-2">
                  <ClipboardDocumentCheckIcon className="w-4 h-4" />
                  <span>Guardar Apariencia</span>
                </span>
              </LoaderButton>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
