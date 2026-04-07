import { ReactNode } from "react";
import "tippy.js/dist/tippy.css";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import DashboardGeneric from "@/layouts/dashboard-generic";
import Sidebar from "@/layouts/sidebar/sidebar";
import {
  NotificationSignalProvider,
  NotificationProvider,
} from "@/sections/notifications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <NotificationSignalProvider>
      <NotificationProvider>
        <DashboardGeneric sidebar={<Sidebar />}>{children}</DashboardGeneric>
      </NotificationProvider>
    </NotificationSignalProvider>
  );
}
