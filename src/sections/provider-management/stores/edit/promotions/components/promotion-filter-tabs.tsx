

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
    <div className="flex gap-3 text-xs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`px-2 py-1 rounded transition-colors text-gray-700 dark:text-gray-300 ${
            filterStatus === tab.key ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100" : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
          onClick={() => onFilterChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
