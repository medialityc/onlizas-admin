"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";

import FormProvider from "@/components/react-hook-form/form-provider";
import { RHFAutocompleteWithAddButton } from "@/components/react-hook-form/rhf-autocomplete-with-add-button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RoleCreateModal from "@/sections/roles/create/role-create-modal";
import { createPermission } from "@/services/permissions";
import { getAllRoles } from "@/services/roles";
import { ICreatePermission } from "@/types/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RHFSelectWithLabel from "../../../components/react-hook-form/rhf-select";
import {
  createPermissionSchema,
  CreatePermissionSchema,
  defaultPermissionForm,
} from "./permissions-schemas";

interface PermissionCreateModalProps {
  open: boolean;
  onClose: () => void;
  permissions?: ICreatePermission[];
}

export default function PermissionCreateModal({
  open,
  onClose,
  permissions = [],
}: PermissionCreateModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<CreatePermissionSchema>({
    resolver: zodResolver(createPermissionSchema(permissions)),
    defaultValues: defaultPermissionForm,
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreatePermissionSchema) => {
    setError(null);
    console.log(data);

    try {
      const response = await createPermission(data);
      handleClose();
      if (response.error) {
        toast.error(response.message || "Error al crear el permiso");
      } else {
        handleClose();
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
        toast.success("Permiso creado exitosamente");
      }
    } catch (err) {
      console.error("Error creating permission:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el permiso";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };
  const permisoOptions = [
    { value: 0, label: "Ver todo" },
    { value: 1, label: "Ver detalles" },
    { value: 2, label: "Crear" },
    { value: 3, label: "Editar" },
    { value: 4, label: "Eliminar" },
    { value: 5, label: "Otro" },
  ];

  return (
    <SimpleModal open={open} onClose={handleClose} title="Crear Nuevo Permiso">
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="name"
              label="Nombre"
              placeholder="Ingrese el nombre"
            />

            <RHFInputWithLabel
              name="code"
              label="Código"
              placeholder="(ej: USERS_CREATE)"
            />
            <RHFInputWithLabel
              name="entity"
              label="Entidad"
              placeholder="Ingrese la entidad"
            />
            <RHFSelectWithLabel
              name="permissionType"
              options={permisoOptions}
              label="Tipo de Permiso"
              placeholder="Seleccione el tipo"
              required
              size="small"
            />
            <div className="md:col-span-2">
              <RHFAutocompleteWithAddButton
                name="roleId"
                label="Rol"
                placeholder="Seleccionar el rol "
                objectValueKey={"id"}
                onFetch={getAllRoles}
                renderOption={(r) => r.name}
                buttonColor="blue"
                onOpenModal={() => setIsRoleModalOpen(true)}
                queryKey="roles"
                required
              />
            </div>

            <div className="md:col-span-2">
              <RHFInputWithLabel
                name="description"
                label="Descripción"
                placeholder="Describe las responsabilidades de este rol"
                type="textarea"
                /* className="h-24" */
              />
            </div>
          </div>

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
            >
              Crear Permiso
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
      <RoleCreateModal
        open={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </SimpleModal>
  );
}
