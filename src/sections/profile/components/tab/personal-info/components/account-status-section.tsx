"use client";

import StatusBadge from "@/components/badge/status-badge";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { UserResponseMe } from "@/types/users";

interface AccountStatusSectionProps {
  user: UserResponseMe | null;
}

export function AccountStatusSection({ user }: AccountStatusSectionProps) {
  // Determinamos qué estado mostrar según la prioridad
  const renderStatusBadge = () => {
    if (user?.isBlocked) {
      return (
        <StatusBadge
          active={false}
          activeText=""
          inactiveText="Bloqueado"
          className="bg-red-100 text-red-800"
        />
      );
    }

    if (user?.isVerified === false) {
      return (
        <StatusBadge
          active={false}
          activeText=""
          inactiveText="Requiere verificación"
          className="bg-yellow-100 text-yellow-800"
        />
      );
    }

    return (
      <StatusBadge
        active={user?.active ?? false}
        activeText="Activo"
        inactiveText="Inactivo"
      />
    );
  };

  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/10">
          <ShieldCheckIcon className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
          Estado de la cuenta
        </h3>
      </div>
      <div className="flex gap-2">{renderStatusBadge()}</div>
    </div>
  );
}
