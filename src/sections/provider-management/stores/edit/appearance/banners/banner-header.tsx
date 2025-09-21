"use client";

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

interface BannerHeaderProps {
  onNew: () => void;
}

export default function BannerHeader({ onNew }: BannerHeaderProps) {
  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasCreatePermission = hasPermission(["CREATE_ALL"]);

  return (
    <div className="flex items-center justify-between mt-2">
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Gestión de Banners</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Crea y gestiona banners promocionales para tu tienda
        </p>
      </div>
      {hasCreatePermission && (
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-md bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-2 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-gray-700"
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo Banner
        </button>
      )}
    </div>
  );
}
