export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ExternalReviewSuccessPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircleIcon className="w-14 h-14 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Proceso aprobado</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          La aprobación externa se registró correctamente. Este enlace ya no
          admite nuevas acciones. Si necesitas revisar otro proceso solicita un
          nuevo token al equipo interno.
        </p>
        <div className="pt-2">
          <h2>Puede cerrar esta pestaña</h2>
        </div>
      </div>
    </main>
  );
}
