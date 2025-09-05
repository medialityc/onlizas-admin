import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import SimpleModal from "@/components/modal/modal";
import { PROMOTION_TYPES, PromotionTypeConfig } from "../../types/promotion-types";
import PromotionTypeCard from "./promotion-type-card";

interface PromotionTypeSelectorModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal para seleccionar tipo de promoción - redirige a páginas específicas
 */
export default function PromotionTypeSelectorModal({
  open,
  onClose
}: PromotionTypeSelectorModalProps) {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const handleSelectType = (config: PromotionTypeConfig) => {
    // Mostrar loading en la tarjeta seleccionada
    setNavigatingTo(config.value);
    
    // Pequeño delay para feedback visual
      setTimeout(() => {
        // Guardar path actual antes de navegar
        if (typeof window !== "undefined") {
          localStorage.setItem('promotionFormBackPath', window.location.pathname + window.location.search);
        }
        onClose();
        router.push(`/stores/${storeId}/promotions/new?type=${config.value}`);
      }, 150);
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Crear descuento"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Descripción */}
        <p className="text-sm text-gray-600">
          Selecciona el tipo de descuento que deseas crear para tu tienda.
        </p>
        
        {/* Grid de tipos de promoción */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {PROMOTION_TYPES.map((config) => (
            <PromotionTypeCard
              key={config.id}
              config={config}
              onClick={handleSelectType}
              isLoading={navigatingTo === config.value}
              disabled={navigatingTo !== null}
            />
          ))}
        </div>
      </div>
    </SimpleModal>
  );
}
