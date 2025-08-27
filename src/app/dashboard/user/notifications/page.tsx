import { buildQueryParams } from "@/lib/request";
import UserNotificationContainer from "@/sections/notifications/receipt/list/notifications-container";
import { getNotificationsByUser } from "@/services/notifications/notification-service";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Gestión de Notificaciones - ZAS Express",
  description: "Gestionar notificaciones del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};
// TODO: Separar esto en otro archivo

interface PageProps {
  searchParams: Promise<SearchParams>;
}
// TODO: Separar en otro componente
function NotificationListSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function UserListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const usersPromise = getNotificationsByUser(query);
  return (
    <Suspense fallback={<NotificationListSkeleton />}>
      <UserNotificationContainer
        usersNotificationsPromise={usersPromise}
        query={params}
      />
    </Suspense>
  );
}

export default UserListPage;
