"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { cn } from "@/lib/utils";
import {
  GetAllNotificationByUserResponse,
  UserNotification,
} from "@/types/notifications";
import { DataTableColumn } from "mantine-datatable";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SearchParams } from "@/types/fetch/request";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { deleteNotification } from "@/services/notifications/notification-service";
import { toast } from "react-toastify";
import IconEye from "@/components/icon/icon-eye";
import IconCheck from "@/components/icon/icon-checks";
import { useModalState } from "@/hooks/use-modal-state";
import NotificationDetailModal from "../notification-detail-modal";
import ActionsMenu from "@/components/menu/actions-menu";
import { Notification } from "../../../../types/notifications";
import showToast from "@/config/toast/toastConfig";
import NotificationCreateModal from "../create/notification-create-modal";

interface NotificationsListProps {
  data?: GetAllNotificationByUserResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function UserNotificationsList({
  data,
  searchParams,
  onSearchParamsChange,
}: NotificationsListProps) {
  const router = useRouter();
  const { getModalState, openModal, closeModal } = useModalState();
  const viewModal = getModalState<number>("view");
  const createModal = getModalState("create");
  const handleCreateUser = useCallback(() => openModal("create"), [openModal]);
  const selectedNotificationUser = useMemo(() => {
    console.log(data);

    const userNotificationId = viewModal.id;
    console.log(userNotificationId);

    if (!userNotificationId || !data?.data) return null;
    return data.data?.find(
      (notification) => notification.id == userNotificationId
    );
  }, [data, viewModal.id]);
  console.log(selectedNotificationUser);

  const handleDeleteNotification = useCallback(
    async (notification: Notification) => {
      try {
        const res = await deleteNotification(notification.id);

        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast("Eliminado correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    []
  );

  /* const handleMarkAsRead = useCallback(async (id: number) => {
    try {
      const response = await markAsRead(id);
      if (!response.error) {
        toast.success("Notificación marcada como leída");
        // Aquí deberías actualizar el estado local o refetch
      } else {
        toast.error("Error al marcar como leída");
      }
    } catch (error) {
      console.error("Error marcando notificación como leída", error);
      toast.error("Error al marcar como leída");
    }
  }, []); */

  const handleViewNotification = useCallback(
    (notification: Notification) => {
      openModal<number>("view", notification?.id);
    },
    [openModal]
  );

  const columns = useMemo<DataTableColumn<Notification>[]>(
    () => [
      {
        accessor: "title",
        title: "Título",
        sortable: true,
        render: (notification) => (
          <div className="font-medium">{notification.title}</div>
        ),
      },
      {
        accessor: "notificationType",
        title: "Tipo de Notificación",
        sortable: true,
        render: (notification) => (
          <div className="text-sm text-gray-600 line-clamp-2">
            {notification.notificationType}
          </div>
        ),
      },
      {
        accessor: "channel",
        title: "Via de Notificación",
        sortable: true,
        render: (notification) => (
          <div className="text-sm text-gray-600 line-clamp-2">
            {notification.channel}
          </div>
        ),
      },
      {
        accessor: "date",
        title: "Fecha",
        sortable: true,
        render: (notification) => (
          <div className="text-sm">
            {format(notification.date, "dd/MM/yyyy HH:mm", {
              locale: es,
            })}
          </div>
        ),
      },
      {
        accessor: "priority",
        title: "Prioridad",
        sortable: true,
        render: (notification) => (
          <span
            className={cn(
              "badge",
              notification.priority === "high"
                ? "badge-outline-danger"
                : notification.priority === "medium"
                  ? "badge-outline-warning"
                  : "badge-outline-success"
            )}
          >
            {notification.priority === "high"
              ? "Alta"
              : notification.priority === "medium"
                ? "Media"
                : "Baja"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        titleClassName: "",
        width: 100,
        render: (notification) => (
          <ActionsMenu
            onViewDetails={() => {
              handleViewNotification(notification);
            }}
            onDelete={() => handleDeleteNotification(notification)}
          />
        ),
      },
    ],
    [handleViewNotification]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onCreate={handleCreateUser}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar notificaciones..."
        emptyText="No hay notificaciones"
      />
      <NotificationCreateModal
        open={createModal.open}
        onClose={() => closeModal("create")}
      />
      {selectedNotificationUser && (
        <NotificationDetailModal
          onClose={() => closeModal("view")}
          isOpen={viewModal.open}
          notification={selectedNotificationUser}
        />
      )}
    </>
  );
}
