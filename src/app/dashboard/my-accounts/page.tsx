import { getServerSession } from "zas-sso-client";
import { getSupplierAccounts } from "@/services/finance/supplier-accounts";
import SupplierAccountsClient from "@/sections/finance/list/supplier-accounts.client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mis Cuentas Bancarias",
};

export default async function MyAccountsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id?.toString();

  if (!userId) {
    redirect("/dashboard");
  }

  const accountsRes = await getSupplierAccounts(userId);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-semibold">Mis Cuentas Bancarias</h1>
      <SupplierAccountsClient 
        initialData={accountsRes.data} 
        supplierId={userId} 
      />
    </div>
  );
}
