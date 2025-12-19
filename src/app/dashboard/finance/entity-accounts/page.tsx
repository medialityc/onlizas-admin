import { getPlatformAccounts } from "@/services/finance/platform-accounts";
import ClientCreateButton from "../../../../sections/finance/list/platform-accounts.client";

export const metadata = {
  title: "Cuentas de la Plataforma | Finanzas",
};

export default async function FinanceEntityAccountsPage() {
  const accountsRes = await getPlatformAccounts();
  return (
    <div className="space-y-6 p-4">
      <ClientCreateButton initialData={accountsRes.data} />
    </div>
  );
}
