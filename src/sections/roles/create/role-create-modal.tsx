"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import RHFInput from "@/components/react-hook-form/rhf-input";

import {
  CreateRoleSchema,
  createRoleSchema,
  defaultRoleForm,
} from "@/sections/roles/create/role-schemas";
import { createRole } from "@/services/roles";
import { IRole } from "@/types/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePermissions } from "zas-sso-client";

interface RoleCreateModalProps {
  open: boolean;
  onClose: () => void;
  roles?: IRole[];
  onSuccess?: () => void;
}

export default function RoleCreateModal({
  open,
  onClose,
  roles = [],
  onSuccess,
}: RoleCreateModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canCreate = hasPermission(["Create"]);

  const methods = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema(roles)),
    defaultValues: defaultRoleForm,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreateRoleSchema) => {
    setError(null);

    try {
      const response = await createRole(data);

      if (response.error) {
        toast.error(response.message || "Error al crear el rol");
      } else {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        onSuccess?.();
        reset();
        toast.success("Rol creado exitosamente");
        handleClose();
      }
    } catch (err) {
      console.error("Error creating role:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el rol";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal open={open} onClose={handleClose} title="Crear Nuevo Rol">
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RHFInput
              name="name"
              label="Nombre del Rol"
              placeholder="Ej: Administrador"
            />
            <RHFInput
              name="code"
              label="Código del Rol"
              placeholder="Ej: ADMIN_ROLE"
            />{" "}
            <RHFInput
              name="description"
              label="Descripción"
              placeholder="Describe las responsabilidades de este rol"
              type="textarea"
              className="h-24"
            />
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <LoaderButton
                type="submit"
                loading={isSubmitting}
                className="btn btn-primary "
                disabled={!canCreate}
              >
                Crear Rol
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
