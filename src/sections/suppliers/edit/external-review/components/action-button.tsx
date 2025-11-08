export default function ActionButton({
  children,
  onClick,
  loading,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading: boolean;
  variant: "approve" | "reject" | "comment";
  disabled?: boolean;
}) {
  const styles: Record<typeof variant, string> = {
    approve: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    reject: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    comment: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  } as const;
  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 transition ${styles[variant]}`}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        </span>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
}
