"use client";

import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import { updateRole } from "@/services/roles";
import { IRole } from "@/types/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllPermissions } from "@/services/permissions";
import { UpdateRoleSchema } from "../create/role-schemas";
import { IRoleUpdateSchema, roleUpdateSchema } from "./role-update-schema";

interface RoleEditModalProps {
  role: IRole;
  open: boolean;
  onClose: () => void;
  roles?: IRole[];
}

export function RoleEditModal({ role, open, onClose }: RoleEditModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      permissions: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  useEffect(() => {
    if (role && open) {
      reset({
        readPermissions: role?.permissions?.map((perm) => perm.id) || [],
        permissions: role?.permissions?.map((perm) => perm.id) || [],
        addPermissionsIds: [],
        removePermissionsIds: [],
      });
    }
  }, [role, open, reset]);

  const onSubmit = async (data: IRoleUpdateSchema) => {
    try {
      const res = await updateRole(role.id, {
        addPermissionsIds: data.addPermissionsIds,
        removePermissionsIds: data.removePermissionsIds,
      });
      if (res?.error) {
        console.error("Error updating role:", res);
        toast.error(res.message || "Error al actualizar el rol");
      } else {
        toast.success("Rol actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        onClose();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error al actualizar el rol");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <SimpleModal
      title="Editar Rol"
      subtitle="Modifica los permisos del rol"
      open={open}
      onClose={handleClose}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <div className="space-y-4 min-h-1/2">
          <RHFAutocompleteFetcherInfinity
            name="permissions"
            label="Permisos"
            required
            onFetch={getAllPermissions}
            multiple
          />
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="btn btn-outline-secondary"
          >
            Cancelar
          </button>
          {hasUpdatePermission && (
            <LoaderButton
              type="submit"
              className="btn "
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Actualizar
            </LoaderButton>
          )}
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
