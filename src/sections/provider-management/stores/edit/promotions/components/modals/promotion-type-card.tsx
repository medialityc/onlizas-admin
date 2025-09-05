
import { PromotionTypeConfig } from "../../types/promotion-types";

interface PromotionTypeCardProps {
  config: PromotionTypeConfig;
  onClick: (config: PromotionTypeConfig) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Tarjeta para cada tipo de promoción - diseño basado en la imagen del modal
 */
export default function PromotionTypeCard({ config, onClick, isLoading = false, disabled = false }: PromotionTypeCardProps) {
  return (
    <div
      onClick={disabled || isLoading ? undefined : () => onClick(config)}
      className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg transition-all group ${
        disabled || isLoading 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
      }`}
    >
      {/* Icono con fondo de color */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.color} ${
        !disabled && !isLoading && "group-hover:scale-105"
      } transition-transform relative`}>
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <span className="text-lg">{config.icon}</span>
        )}
      </div>
      
      {/* Contenido del texto */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-gray-900 text-sm mb-1 transition-colors ${
          !disabled && !isLoading && "group-hover:text-blue-700"
        }`}>
          {isLoading ? "Cargando..." : config.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {isLoading ? "Redirigiendo al formulario..." : config.description}
        </p>
      </div>
    </div>
  );
}
