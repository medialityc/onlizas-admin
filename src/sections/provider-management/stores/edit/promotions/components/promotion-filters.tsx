
import PromotionFilterTabs from "./promotion-filter-tabs";
import PromotionSearchInput from "./promotion-search-input";

interface PromotionFiltersProps {
  filterStatus: string;
  searchValue: string;
  onFilterChange: (status: string) => void;
  onSearchChange: (value: string) => void;
}

/**
 * Componente que agrupa filtros y búsqueda
 * Mantiene la UI organizada y reutilizable
 */
export default function PromotionFilters({
  filterStatus,
  searchValue,
  onFilterChange,
  onSearchChange
}: PromotionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-3">
      <PromotionFilterTabs 
        filterStatus={filterStatus} 
        onFilterChange={onFilterChange} 
      />
      <PromotionSearchInput 
        value={searchValue} 
        onChange={onSearchChange} 
      />
    </div>
  );
}
