"use client";
import React from "react";
import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors",
        !notification.isRead && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(new Date(notification.date), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
}
