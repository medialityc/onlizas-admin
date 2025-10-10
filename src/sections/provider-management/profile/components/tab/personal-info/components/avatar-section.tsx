"use client";

import { CardTitle, CardDescription } from "@/components/cards/card";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import StatusBadge from "@/components/badge/status-badge";
import LoaderButton from "@/components/loaders/loader-button";
import { UserResponseMe } from "@/types/users";

interface AvatarSectionProps {
  user: UserResponseMe | null;
  errors: any;
  isLoading: boolean;
}

export function AvatarSection({ user, errors, isLoading }: AvatarSectionProps) {
  return (
    <div className="flex items-center gap-4 justify-between w-full">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <RHFImageUpload
            name="photoFile"
            label="Foto"
            // defaultImage={user?.photoUrl}
            variant="rounded"
            size="md"
          />
          {errors.photoFile && (
            <p className="text-xs text-red-500 mt-1">
              ❌ {errors.photoFile.message}
            </p>
          )}
        </div>

        {/* Título con nombre */}
        <div>
          <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
          <CardDescription>
            <div className="mt-2">
              <StatusBadge
                active={user?.active ?? false}
                activeText="Proveedor verificado"
                inactiveText="No verificado"
              />
            </div>
          </CardDescription>
        </div>
      </div>

      <div className="ml-4">
        <LoaderButton type="submit" loading={isLoading} className="px-4 py-2">
          Guardar
        </LoaderButton>
        {Object.keys(errors).length > 0 && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">
              ⚠️ Hay {Object.keys(errors).length} error(es) en el formulario
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
