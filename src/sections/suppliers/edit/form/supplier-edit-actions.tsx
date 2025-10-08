import LoaderButton from "@/components/loaders/loader-button";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { UpdateSupplierFormData } from "./schema";
import { usePermissions } from "zas-sso-client";

export default function SupplierEditActions({
  isLoading,
  onCancel,
}: {
  isLoading: boolean;
  onCancel: () => void;
}) {
  const {
    formState: { isValid, dirtyFields },
  } = useFormContext<UpdateSupplierFormData>();

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const hasUpdatePermission = hasPermission([ "Update"]);

  // Consider only meaningful fields for the dirty indicator (ignore temp pickers, etc.)
  const hasMeaningfulDirty = useMemo(() => {
    const df = dirtyFields as any;
    return !!(
      df?.name ||
      df?.email ||
      df?.phone ||
      df?.address ||
      df?.message ||
      df?.type ||
      df?.isActive ||
      df?.sellerType ||
      df?.nacionalityType ||
      df?.mincexCode ||
      df?.pendingCategories ||
      df?.approvedCategories
    );
  }, [dirtyFields]);

  return (
    <div>
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
            disabled={!hasMeaningfulDirty || isLoading || !isValid}
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
