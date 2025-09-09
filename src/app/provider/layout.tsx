import { ReactNode } from "react";
import AuthGuard from "@/auth-sso/providers/auth-guard";
import DashboardGeneric from "@/layouts/dashboard-generic";
import SidebarProvider from "@/layouts/sidebar/sidebar-provider/sidebar-provider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <DashboardGeneric sidebar={<SidebarProvider />}>
      <AuthGuard>{children}</AuthGuard>
    </DashboardGeneric>
  );
}
