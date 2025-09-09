import { ReactNode } from "react";

import AuthGuard from "@/auth-sso/providers/auth-guard";
import "tippy.js/dist/tippy.css";
import DashboardGeneric from "@/layouts/dashboard-generic";
import Sidebar from "@/layouts/sidebar/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <DashboardGeneric sidebar={<Sidebar />}>
      <AuthGuard>{children}</AuthGuard>
    </DashboardGeneric>
  );
}
