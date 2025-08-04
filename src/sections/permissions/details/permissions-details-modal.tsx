"use client";

import SimpleModal from "@/components/modal/modal";
import { IPermission } from "@/types/permissions";

interface PermissionDetailsModalProps {
  permission: IPermission;
  open: boolean;
  onClose: () => void;
}

export function PermissionDetailsModal({
  permission,
  open,
  onClose,
}: PermissionDetailsModalProps) {
  return (
    <SimpleModal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detalles del Permiso
          </h2>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {permission.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rol
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {permission.roleName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código
              </label>
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {permission.code}
              </p>
            </div>
          </div>

          {/* Description */}
          {permission.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {permission.description}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
