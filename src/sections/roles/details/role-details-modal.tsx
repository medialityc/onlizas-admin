"use client";

import SimpleModal from "@/components/modal/modal";
import { IRole } from "@/types/roles";

interface RoleDetailsModalProps {
  role: IRole;
  open: boolean;
  onClose: () => void;
}

export function RoleDetailsModal({
  role,
  open,
  onClose,
}: RoleDetailsModalProps) {
  return (
    <SimpleModal title="Detalles del Rol" open={open} onClose={onClose}>
      <div className="p-4">      
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {role.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código
              </label>
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {role.code}
              </p>
            </div>
          </div>

          {/* Description */}
          {role.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {role.description}
              </p>
            </div>
          )}

          {/* Permissions Section - Placeholder for future implementation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permisos
            </label>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {role.permissions && role.permissions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {role.permissions.map(permission => (
                    <li
                      key={permission.id}
                      className="text-sm text-gray-900 dark:text-white"
                    >
                      {permission.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Este rol no tiene permisos asignados.
                </p>
              )}
            </div>
          </div>
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
