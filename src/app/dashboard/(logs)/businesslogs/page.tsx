export const metadata = {
  title: "Logs del Sistema - Onlizas",
  description: "Visualiza los registros de actividad del sistema",
};

export default function BusinessLogsPage() {
  return (
    <div className="panel p-6">
      <p className="text-center text-gray-600 dark:text-gray-400">
        Selecciona un tipo de log en el menú superior para ver los registros.
      </p>
    </div>
  );
}
