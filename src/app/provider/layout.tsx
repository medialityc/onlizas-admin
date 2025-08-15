import { ReactNode } from "react";
import AuthGuard from "@/auth-sso/providers/auth-guard";
import DashboardProviderLayout from "@/layouts/dashboard-layout-provider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <DashboardProviderLayout>
      <AuthGuard>{children}</AuthGuard>
    </DashboardProviderLayout>
  );
}
