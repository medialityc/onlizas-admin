import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getAdminDashboard, getSupplierDashboard } from "@/services/dashboard";
import AdminDashboardContainer from "./admin-dashboard-container";
import SupplierDashboardContainer from "./supplier-dashboard-container";

export default async function DashboardServerWrapper() {
  const { isAdmin, isSupplier } = await getModulePermissions("dashboard");

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

  return (
    <div className="panel p-6">
      <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No tiene permisos para visualizar el dashboard.
      </p>
    </div>
  );
}
