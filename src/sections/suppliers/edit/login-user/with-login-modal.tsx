"use client";

import { RHFCheckbox, RHFInputWithLabel } from "@/components/react-hook-form";
import FormProvider from "@/components/react-hook-form/form-provider";
import LoaderButton from "@/components/loaders/loader-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WithLoginForm, withLoginSchema } from "./whitloginSchema";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface WithLoginModalProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { changePassword: boolean; password: string }) => void;
}

export default function WithLoginModal({
  open,
  isLoading,
  onClose,
  onSubmit,
}: WithLoginModalProps) {
  const methods = useForm<WithLoginForm>({
    resolver: zodResolver(withLoginSchema),
    defaultValues: { changePassword: true, password: "", confirmPassword: "" },
  });
  const { reset } = methods;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Crear usuario para la solicitud
        </h2>
        <FormProvider
          methods={methods}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <RHFCheckbox
            name="changePassword"
            label="Cambiar contraseña en próximo inicio de sesión"
          />

          <div className="space-y-3">
            <RHFInputWithLabel
              name="password"
              type="password"
              label="Contraseña"
              placeholder="Nueva contraseña"
              required
            />
            <RHFInputWithLabel
              name="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              placeholder="Repite la contraseña"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isLoading}
              className="px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            {hasUpdatePermission && (
              <LoaderButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="px-3 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Crear usuario
              </LoaderButton>
            )}
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
