"use client";

import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { updatePermission } from "@/services/permissions";
import { IPermission } from "@/types/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  PermissionUpdateData,
  permissionUpdateSchema,
} from "./permissions-update-schema";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

interface PermissionEditModalProps {
  permission: IPermission;
  open: boolean;
  onClose: () => void;
  permissions?: IPermission[];
}

export function PermissionEditModal({
  permission,
  open,
  onClose,
  permissions = [],
}: PermissionEditModalProps) {
  const queryClient = useQueryClient();
  const { data: userPermissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => userPermissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);
  const methods = useForm<PermissionUpdateData>({
    resolver: zodResolver(permissionUpdateSchema(permissions)),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      entity: "",
      type: 0,
    },
  });

  const {
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (permission && open) {
      reset({
        name: permission.name ?? "",
        code: permission.code ?? "",
        description: permission.description ?? "",
        entity: permission.entity ?? "",
        type: permission.permissionType ?? 0,
      });
    }
  }, [permission, open, reset]);

  const onSubmit = async (data: PermissionUpdateData) => {
    try {
      const res = await updatePermission(permission.id, data);
      if (res?.error) {
        console.error("Error updating permission:", res);
        toast.error(res.message || "Error al actualizar el permiso");
      } else {
        toast.success("Permiso actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
        onClose();
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Error al actualizar el permiso");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <SimpleModal open={open} onClose={handleClose}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar Permiso
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Modifica la información del permiso seleccionado
          </p>
        </div>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            <RHFInputWithLabel
              name="name"
              label="Nombre"
              placeholder="Ingrese el nombre del permiso"
            />

            <RHFInputWithLabel
              name="code"
              label="Código"
              placeholder="Ingrese el código del permiso (ej: ADMIN, USER, MODERATOR)"
            />
            <RHFInputWithLabel
              name="entity"
              label="Entidad"
              placeholder="Ingrese el nombre de la entidad"
            />

            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Ingrese una descripción para el permiso"
              type="textarea"
              className="h-24"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
            {hasUpdatePermission && (
              <LoaderButton
                type="submit"
                className="btn btn-primary"
                loading={isSubmitting}
                disabled={isSubmitting || !isValid}
              >
                Actualizar
              </LoaderButton>
            )}
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
