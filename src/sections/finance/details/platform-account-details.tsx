"use client";
import { PlatformAccount } from "@/types/finance";
import clsx from "clsx";

interface Props {
  account: PlatformAccount;
}

export default function PlatformAccountDetails({ account }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cuenta de Plataforma</h1>
        <span
          className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            account.active
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          )}
        >
          {account.active ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard label="Nombre" value={account.name} />
        <DetailCard label="Número de cuenta" value={account.accountNumber} />
        <DetailCard label="Banco" value={account.bank} />
        <DetailCard label="Propósito" value={account.purposeName} />
        <DetailCard
          label="Principal"
          value={account.isMainAccount ? "Sí" : "No"}
        />
      </div>

      {account.description && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-sm font-semibold mb-2">Descripción</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {account.description}
          </p>
        </div>
      )}
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100 break-words">
        {value ?? "-"}
      </span>
    </div>
  );
}
