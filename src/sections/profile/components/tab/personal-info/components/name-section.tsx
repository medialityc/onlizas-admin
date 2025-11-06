"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { UserResponseMe } from "@/types/users";

interface NameSectionProps {
  user: UserResponseMe | null;
  errors: any;
}

export function NameSection({ user, errors }: NameSectionProps) {
  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/10">
            <IdentificationIcon className="h-5 w-5 text-dark-dark-light-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Nombre
          </h3>
        </div>
      </div>
      <RHFInputWithLabel name="name" label="" placeholder="Usuario" required />
      {errors.name && (
        <p className="text-xs text-red-500 mt-1">❌ {errors.name.message}</p>
      )}
    </div>
  );
}
