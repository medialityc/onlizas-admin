"use client";
import { useParams } from "next/navigation";
import { PayablesReceivablesList } from "@/sections/finance/list/payables-receivables-list";

export default function ClosureAccountsPage() {
  const params = useParams();
  const closureId = params?.closureId as string;
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">Cuentas del cierre {closureId}</h1>
      <PayablesReceivablesList
        data={{ items: [], total: 0 }}
        searchParams={{}}
        onSearchParamsChange={() => {}}
      />
    </div>
  );
}
