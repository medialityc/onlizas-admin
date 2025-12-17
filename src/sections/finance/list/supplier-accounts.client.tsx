"use client";

import { GetSupplierAccounts } from "@/types/finance";
import SupplierAccountsList from "./supplier-accounts-list";

interface Props {
  initialData?: GetSupplierAccounts;
  supplierId: string;
}

export default function SupplierAccountsClient({
  initialData,
  supplierId,
}: Props) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Mis Cuentas Bancarias</h2>
          <p className="text-sm text-gray-500">
            Administra tus cuentas bancarias para recibir pagos
          </p>
        </div>
      </div>
      <SupplierAccountsList data={initialData} supplierId={supplierId} />
    </div>
  );
}
