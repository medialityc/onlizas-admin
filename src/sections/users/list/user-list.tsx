"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { SearchParams } from "@/types/fetch/request";
import { GetAllUsersResponse, IUser } from "@/types/users";
import { DataTableColumn } from "mantine-datatable";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import UserCreateModal from "../create/user-create-container";
import { useRouter } from "next/navigation";
import { useModalState } from "@/hooks/use-modal-state";

import { toast } from "react-toastify";
import { revalidateTagFn } from "@/services/revalidate";
import { activateUser } from "@/services/users";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM, PERMISSIONS } from "@/lib/permissions";

interface UserListProps {
  data?: GetAllUsersResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function UserList({
  data,
  searchParams,
  onSearchParamsChange,
}: UserListProps) {
  const router = useRouter();
  const { getModalState, openModal, closeModal } = useModalState();
  const createModal = getModalState("create");

  const handleCreateUser = useCallback(() => openModal("create"), [openModal]);

  const toggleActive = useCallback(async (user: IUser) => {
    try {
      const response = await activateUser(user.id);

      if (!response.error) {
        revalidateTagFn("users");
      } else if (response.message) {
        toast.error(response.message);
      } else {
        toast.error(
          user.active
            ? "Error al desactivar el usuario"
            : "Error al activar el usuario"
        );
      }
    } catch (error) {
      console.error(
        user.active ? "Error desactivando usuario" : "Error activando usuario",
        error
      );
      toast.error(
        user.active
          ? "Error al desactivar el usuario"
          : "Error al activar el usuario"
      );
    }
  }, []);

  // Log en el handler de editar atributos

  const columns = useMemo<DataTableColumn<IUser>[]>(
    () => [
      {
        title: " ",
        accessor: "profilePicturePath",
        width: 60,
        render: (user) => (
          <div className="flex items-center justify-center">
            {user.profilePicturePath ? (
              <Image
                src={user.profilePicturePath}
                alt={`${user.firstName} ${user.lastName}`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (user) => (
          <div className="font-medium">
            <Link
              href={paths.dashboard.users.edit(user.id)}
              className="hover:text-primary"
            >
              {user.name}
            </Link>
          </div>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        render: (user) => (
          <div className="font-medium">
            <span
              className={cn(
                "badge",
                user.active ? "badge-outline-success" : "badge-outline-danger"
              )}
            >
              {user.active ? "Activo" : "Inactivo"}
            </span>
          </div>
        ),
      },

      {
        accessor: "emails",
        title: "Correos Electrónicos",
        sortable: true,
        render: (user) => (
          <div className="flex flex-col gap-1">
            {user.emails && user.emails.length > 0 ? (
              user.emails.map(({ address, isVerified }, index) => (
                <p
                  key={index}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{address}</span>
                  <span
                    className={cn(
                      "badge",
                      isVerified
                        ? "badge-outline-success"
                        : "badge-outline-danger"
                    )}
                  >
                    {isVerified ? "Verificado" : "Sin verificar"}
                  </span>
                </p>
              ))
            ) : (
              <span className="text-sm text-gray-500">Sin correos</span>
            )}
          </div>
        ),
      },

      {
        accessor: "phones",
        title: "Números de Teléfono",
        sortable: true,
        render: (user) => (
          <div className="flex flex-col gap-1">
            {user.phoneNumbers && user.phoneNumbers.length > 0 ? (
              user.phoneNumbers.map(({ number, isVerified }, index) => (
                <p
                  key={index}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span>{number}</span>
                  <span
                    className={cn(
                      "badge",
                      isVerified
                        ? "badge-outline-success"
                        : "badge-outline-danger"
                    )}
                  >
                    {isVerified ? "Verificado" : "Sin verificar"}
                  </span>
                </p>
              ))
            ) : (
              <span className="text-sm text-gray-500">Sin teléfonos</span>
            )}
          </div>
        ),
      },
      {
        accessor: "roles",
        title: "Roles",
        width: 200,
        render: (user) => (
          <div className="flex flex-wrap gap-1">
            {user.roles && user.roles.length > 0 ? (
              user.roles.slice(0, 2).map((role, index) => (
                <span
                  key={index}
                  className="badge badge-outline-primary text-xs"
                >
                  {role.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No roles</span>
            )}
            {user.roles && user.roles.length > 2 && (
              <span className="text-xs text-gray-500">
                +{user.roles.length - 2} more
              </span>
            )}
          </div>
        ),
      },

      {
        accessor: "actions",
        title: "Acciones",
        titleClassName: "bg-gray-500 dark:bg-gray-800",

        width: 100,
        render: (user) => (
          <ActionsMenu
            onEdit={() => router.push(paths.dashboard.users.edit(user.id))}
            active={user.active}
            onActive={() => toggleActive(user)}
          />
        ),
      },
    ],
    [router, toggleActive]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        onCreate={handleCreateUser}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar..."
        emptyText="No se encontraron usuarios"
        className="mt-6"
        createPermissions={[PERMISSION_ENUM.CREATE]}
      />
      <UserCreateModal
        open={createModal.open}
        onClose={() => closeModal("create")}
      />
    </>
  );
}
