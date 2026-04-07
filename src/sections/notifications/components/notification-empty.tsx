"use client";

import IconBellBing from "@/components/icon/icon-bell-bing";

export function NotificationEmpty() {
  return (
    <li onClick={(e) => e.stopPropagation()}>
      <div className="flex min-h-52 flex-col items-center justify-center gap-3 px-6 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
          <IconBellBing className="h-7 w-7 text-gray-400 dark:text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Todo al día
          </p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            No tienes notificaciones pendientes
          </p>
        </div>
      </div>
    </li>
  );
}
