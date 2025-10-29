import LoaderButton from "@/components/loaders/loader-button";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { UpdateSupplierFormData } from "./schema";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

export default function SupplierEditActions({
  isLoading,
  onCancel,
}: {
  isLoading: boolean;
  onCancel: () => void;
}) {
  const {
    formState: { isValid, dirtyFields, errors },
  } = useFormContext<UpdateSupplierFormData>();
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  // Consider only meaningful fields for the dirty indicator (ignore temp pickers, etc.)
  const hasMeaningfulDirty = useMemo(() => {
    const df = dirtyFields as any;
    return !!(
      df?.name ||
      df?.email ||
      df?.phone ||
      df?.countryCode ||
      df?.address ||
      df?.message ||
      df?.type ||
      df?.active ||
      df?.sellerType ||
      df?.nacionalityType ||
      df?.mincexCode ||
      df?.pendingCategories ||
      df?.approvedCategories
    );
  }, [dirtyFields]);

  return (
    <div>
      {/* Global form error summary */}
      {Object.keys(errors || {}).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3 mb-4">
          <p className="text-sm text-red-700 dark:text-red-200">
            Hay errores en el formulario. Por favor revisa los campos marcados.
          </p>
        </div>
      )}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        {hasUpdatePermission && (
          <LoaderButton
            type="submit"
            loading={isLoading}
            disabled={!hasMeaningfulDirty || isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </LoaderButton>
        )}
      </div>
      {hasMeaningfulDirty && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Tienes cambios sin guardar. Asegúrate de guardar antes de salir.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
