

interface PromotionFilterTabsProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

/**
 * Componente separado para los tabs de filtro
 * Mantiene la UI simple y reutilizable
 */
export default function PromotionFilterTabs({ filterStatus, onFilterChange }: PromotionFilterTabsProps) {
  const tabs = [
    { key: "all", label: "Todas" },
    { key: "active", label: "Activas" },
    { key: "inactive", label: "Inactivas" }
  ];

  return (
    <div className="flex gap-3 text-xs text-gray-600">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`px-2 py-1 rounded transition-colors ${
            filterStatus === tab.key ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50"
          }`}
          onClick={() => onFilterChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
