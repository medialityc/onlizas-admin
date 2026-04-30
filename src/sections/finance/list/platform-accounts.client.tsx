import { GetPlatformAccounts } from "@/types/finance";
import PlatformAccountsList from "@/sections/finance/list/platform-accounts-list";

export default function ClientCreateButton({
  initialData,
}: {
  initialData?: GetPlatformAccounts;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">Cuentas de la plataforma</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cuentas destino por propósito</p>
        </div>
      </div>
      <PlatformAccountsList data={initialData} />
    </div>
  );
}
