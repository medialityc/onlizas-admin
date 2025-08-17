import NavigationLogs from "@/sections/logs/navigation-logs";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Encabezado atractivo */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <ClipboardDocumentListIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Registros del sistema
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecciona un módulo para ver sus logs
            </p>
          </div>
        </div>
      </div>
      <NavigationLogs />
      {children}
    </div>
  );
}
