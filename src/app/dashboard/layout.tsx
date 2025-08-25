import { ReactNode } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import AuthGuard from '@/auth-sso/providers/auth-guard';
import 'tippy.js/dist/tippy.css';

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
