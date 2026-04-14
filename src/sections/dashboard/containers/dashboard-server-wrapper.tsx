import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getAdminDashboard, getSupplierDashboard } from "@/services/dashboard";
import AdminDashboardContainer from "./admin-dashboard-container";
import SupplierDashboardContainer from "./supplier-dashboard-container";
import { error } from "console";
import { unauthorized } from "next/navigation";

interface DashboardServerWrapperProps {
  permissions?: {
    isAdmin: boolean;
    isSupplier: boolean;
  };
}

export default async function DashboardServerWrapper({
  permissions,
}: DashboardServerWrapperProps = {}) {
  const resolvedPermissions =
    permissions ?? (await getModulePermissions("dashboard"));
  const { isAdmin, isSupplier } = resolvedPermissions;
  if (isAdmin) {
    const adminDashboardPromise = await getAdminDashboard();
    return <AdminDashboardContainer dashboardPromise={adminDashboardPromise} />;
  }

  if (isSupplier) {
    const supplierDashboardPromise = await getSupplierDashboard();
    return (
      <SupplierDashboardContainer dashboardPromise={supplierDashboardPromise} />
    );
  }

  return unauthorized();
}
