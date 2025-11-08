export default function DetailsCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50/60 dark:bg-gray-800/60">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {title}
        </h3>
      </div>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 px-4 py-3">
        {children}
      </dl>
    </div>
  );
}
