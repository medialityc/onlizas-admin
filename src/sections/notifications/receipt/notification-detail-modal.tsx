"use client";
import SimpleModal from "@/components/modal/modal";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notifications";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NotificationDetailModalProps {
  isOpen?: boolean;
  onClose: () => void;
  notification: Notification;
}

export default function NotificationDetailModal({
  onClose,
  notification,
}: NotificationDetailModalProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Normal";
    }
  };

  return (
    <SimpleModal
      open={!!notification}
      onClose={onClose}
      title={notification.title}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Priority Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Prioridad:</span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getPriorityColor(notification.priority)
            )}
          >
            {getPriorityLabel(notification.priority)}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Fecha:</span>
          <span className="text-sm text-gray-600">
            {format(
              new Date(notification.date),
              "dd 'de' MMMM 'de' yyyy 'a las' HH:mm",
              {
                locale: es,
              }
            )}
          </span>
        </div>

        {/* Notification Type */}
        {notification.notificationType && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <span className="text-sm text-gray-600">
              {notification.notificationType}
            </span>
          </div>
        )}

        {/* Message */}
        <div>
          <span className="text-sm font-medium text-gray-700 block mb-2">
            Mensaje:
          </span>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Read Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span
            className={cn(
              "text-sm",
              notification.isRead ? "text-gray-600" : "text-blue-600"
            )}
          >
            {notification.isRead ? "Leído" : "No leído"}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </SimpleModal>
  );
}
