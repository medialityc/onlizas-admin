
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface PromotionSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Componente separado para el input de búsqueda
 * Reutilizable y mantenible
 */
export default function PromotionSearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar promociones..." 
}: PromotionSearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
      />
    </div>
  );
}
