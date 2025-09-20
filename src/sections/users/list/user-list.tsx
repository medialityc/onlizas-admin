"use client";

import ActionsMenu from "@/components/menu/actions-menu";
import { DataGrid } from "@/components/datagrid/datagrid";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";

import { SearchParams } from "@/types/fetch/request";
import { GetAllUsersResponse, IUser } from "@/types/users";
import { DataTableColumn } from "mantine-datatable";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import UserAttributesModal from "./components/user-attributes-modal";
import { useModalState } from "@/hooks/use-modal-state";
import UserCreateModal from "../create/user-create-container";
import { toast } from "react-toastify";
import { activateUser, deactivateUser } from "@/services/users";
import UserDetailsModal from "../details/user-details";

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
  const viewModal = getModalState<number>("view");
  const editAttributesModal = getModalState<number>("edit_attributes");

  const selectedUser = useMemo(() => {
    const userId = editAttributesModal.id || viewModal.id;
    if (!userId || !data?.data) return null;
    return data.data.find((user) => user.id == userId);
  }, [editAttributesModal.id, data?.data, viewModal.id]);

  const handleCreateUser = useCallback(() => openModal("create"), [openModal]);

  const toggleActive = useCallback(async (user: IUser) => {
    try {
      let response;
      if (user.isActive) {
        response = await deactivateUser(user.id);
      } else {
        response = await activateUser(user.id);
      }
      if (!response.error) {
        toast.error(response.message);
      } else {
        toast.error(
          user.isActive
            ? "Error al desactivar el usuario"
            : "Error al activar el usuario"
        );
      }
    } catch (error) {
      console.error(
        user.isActive
          ? "Error desactivando usuario"
          : "Error activando usuario",
        error
      );
      toast.error(
        user.isActive
          ? "Error al desactivar el usuario"
          : "Error al activar el usuario"
      );
    }
  }, []);

  const handleView = useCallback(
    (user: IUser) => {
      openModal<number>("view", user.id);
    },
    [openModal]
  );

 
  const columns = useMemo<DataTableColumn<IUser>[]>(
    () => [
      {
        title: " ",
        accessor: "photoUrl",
        width: 60,
        render: (user) => (
          <div className="flex items-center justify-center">
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={`${user.name}`}
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
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        render: (user) => (
          <div className="font-medium">
            <span
              className={cn(
                "badge",
                user.isActive ? "badge-outline-success" : "badge-outline-danger"
              )}
            >
              {user.isActive ? "Activo" : "Inactivo"}
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
            {user.emails.length > 0 ? (
              user.emails.map(({ address, isVerified }, index) => (
                <p
                  key={index}
                  className="text-sm flex items-center justify-between  gap-2"
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
            {user.phones.length > 0 ? (
              user.phones.map(({ number, isVerified }, index) => (
                <p
                  key={index}
                  className="text-sm flex items-center justify-between gap-2"
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
            {user.roles.length > 0 ? (
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
            {user.roles.length > 2 && (
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
            onViewDetails={() => handleView(user)}
            onEdit={() => router.push(paths.dashboard.users.edit(user.id))}
            onViewDocuments={() =>
              router.push(paths.dashboard.users.documents.list(user.id))
            }
            isActive={user.isActive}
            onActive={() => toggleActive(user)}           
            viewPermissions={["READ_ALL"]}
            editPermissions={["UPDATE_ALL"]}            
            activePermissions={["UPDATE_ALL"]}
            documentsPermissions={["READ_ALL", "DOCUMENT_VALIDATE"]}
                      />
        ),
      },
    ],
    [router, handleView, toggleActive]
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
        createPermissions={["CREATE_ALL"]}
      />
      <UserCreateModal
        open={createModal.open}
        onClose={() => closeModal("create")}
      />
      {selectedUser && (
        <UserDetailsModal
          onClose={() => closeModal("view")}
          open={viewModal.open}
          user={selectedUser}
        />
      )}
      {selectedUser && (
        <UserAttributesModal
          onClose={() => closeModal("edit_attributes")}
          open={editAttributesModal.open}
          user={selectedUser}
        />
      )}
    </>
  );
}
