import { ReactNode } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import AuthGuard from '@/auth-sso/providers/auth-guard';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <DashboardLayout>
      <AuthGuard>{children}</AuthGuard>
    </DashboardLayout>
  );
}
