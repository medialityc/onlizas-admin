import { ReactNode } from "react";
import "tippy.js/dist/tippy.css";
import DashboardGeneric from "@/layouts/dashboard-generic";
import Sidebar from "@/layouts/sidebar/sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <DashboardGeneric sidebar={<Sidebar />}>{children}</DashboardGeneric>;
}
