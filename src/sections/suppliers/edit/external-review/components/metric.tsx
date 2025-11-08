export default function Metric({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 shadow-sm">
      <span className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span
        className="text-xs font-medium truncate"
        title={String(value ?? "—")}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
