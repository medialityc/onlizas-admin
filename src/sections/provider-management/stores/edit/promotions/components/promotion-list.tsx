import { Promotion } from "@/types/promotions";
import PromotionRow from "./promotion-row";

interface PromotionListProps {
  promotions: Promotion[];
  isLoading: boolean;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
  onViewDetails: (promotion: Promotion) => void;
}

/**
 * Componente para la lista de promociones
 * Maneja el estado de loading y renderizado de items
 */
export default function PromotionList({
  promotions,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails
}: PromotionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron promociones
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {promotions.map((promotion, index) => (
        <PromotionRow
          key={promotion.id || `promotion-${index}`}
          p={promotion}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
