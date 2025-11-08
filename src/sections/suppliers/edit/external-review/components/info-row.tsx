export default function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="mt-0.5 text-gray-400">{icon}</span>}
      <div className="flex flex-col text-xs">
        <dt className="text-[10px] tracking-wide text-gray-400 uppercase">
          {label}
        </dt>
        <dd className="font-medium text-gray-700 dark:text-gray-200 break-words max-w-[240px]">
          {value ?? "—"}
        </dd>
      </div>
    </div>
  );
}
