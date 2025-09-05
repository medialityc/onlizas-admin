

interface FilterInfoBannerProps {
  filterStatus: string;
  onClearFilter: () => void;
}

/**
 * Banner informativo que aparece cuando hay filtros activos
 * Informa al usuario sobre el comportamiento de los filtros con toggle
 */
export default function FilterInfoBanner({ filterStatus, onClearFilter }: FilterInfoBannerProps) {
  if (filterStatus === "all") return null;

  const filterLabel = filterStatus === "active" ? "activas" : "inactivas";

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-800">
            Mostrando solo promociones <strong>{filterLabel}</strong>. 
            Al cambiar el estado, la promoción puede desaparecer de esta vista.
          </span>
        </div>
        <button
          onClick={onClearFilter}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Ver todas
        </button>
      </div>
    </div>
  );
}
