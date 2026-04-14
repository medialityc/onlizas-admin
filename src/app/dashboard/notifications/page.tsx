import { NotificationsFullList } from "@/sections/notifications/list/notifications-full-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificaciones | Onlizas",
  description: "Centro de notificaciones",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <NotificationsFullList />
    </div>
  );
}
