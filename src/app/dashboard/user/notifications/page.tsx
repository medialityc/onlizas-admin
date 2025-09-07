import { buildQueryParams } from "@/lib/request";
import UserNotificationContainer from "@/sections/notifications/receipt/list/notifications-container";
import { getNotificationsByUser } from "@/services/notifications/notification-service";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Notificaciones - ZAS Express",
  description: "Gestionar notificaciones del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function UserListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const usersPromise = getNotificationsByUser(query);
  return (
    <UserNotificationContainer
      usersNotificationsPromise={usersPromise}
      query={params}
    />
  );
}

export default UserListPage;
