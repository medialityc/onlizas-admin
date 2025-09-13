import AuthGuard from "@/auth-sso/providers/auth-guard";
import { getSession } from "@/auth-sso/services/server-actions";
import DashboardGeneric from "@/layouts/dashboard-generic";
import { AppSidebar } from "@/layouts/sidebar/app-sidebar/app-sidebar";
import { redirect } from "next/navigation";

export default async function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.user) {
    redirect("/");
  }
  return (
    <DashboardGeneric sidebar={<AppSidebar />}>
      <AuthGuard>
        <div className="px-2 ">{children}</div>
      </AuthGuard>
    </DashboardGeneric>
  );
}
