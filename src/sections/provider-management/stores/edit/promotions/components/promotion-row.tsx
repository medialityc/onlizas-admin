import type { Promotion } from "@/types/promotions";
import Badge from "@/components/badge/badge";
import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { getPromotionTypeName } from "../index-refactored";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

interface PromotionRowProps {
  p: Promotion;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (promotion: Promotion) => void;
}

export default function PromotionRow({ p, onEdit, onDelete, onViewDetails }: PromotionRowProps) {
  const isExpired = p.endDate && new Date(p.endDate) < new Date();

  // Control de permisos
  const hasReadPermission = useHasPermissions(["READ_ALL"]);
  const hasUpdatePermission = useHasPermissions(["UPDATE_ALL"]);
  const hasDeletePermission = useHasPermissions(["DELETE_ALL"]);

  const getDiscountText = (type: number, value: number) => {
    return type === 0 ? `-${value}%` : `-$${value}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all select-none dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</h4>
            {p.isActive && !isExpired && <Badge variant="outline-primary" className="!text-[11px] !px-2 !py-0.5" rounded>Activa</Badge>}
            {isExpired && <Badge variant="outline-danger" className="!text-[11px] !px-2 !py-0.5" rounded>Vencida</Badge>}
            {!p.isActive && !isExpired && <Badge variant="outline-secondary" className="!text-[11px] !px-2 !py-0.5" rounded>Inactiva</Badge>}
          </div>
          {p.description && <p className="text-xs text-gray-500 dark:text-gray-300">{p.description}</p>}
          <span className="text-xs font-normal text-gray-500 dark:text-gray-300 uppercase tracking-wide">Tipo: {getPromotionTypeName(p.promotionType)}
          </span>

          <div className="text-[11px] text-gray-500 mt-1">
            {p.code ? (<span className="font-medium">{p.code}</span>) : null}
            {p.startDate && p.endDate ? (
              <span className="ml-2 dark:text-gray-300">{formatDate(p.startDate)} - {formatDate(p.endDate)}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {getDiscountText(p.discountType, p.discountValue)}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-300">{p.usedCount ?? 0} usos</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onEdit && hasUpdatePermission && (
              <button
                onClick={() => onEdit(p)}
                className="p-1 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition-colors"
                title="Editar promoción"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}

            {onDelete && hasDeletePermission && (
              <button
                onClick={() => onDelete(p.id)}
                className="p-1 text-gray-400 dark:text-gray-400 hover:text-red-600 transition-colors"
                title="Eliminar promoción"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}

            {onViewDetails && hasReadPermission && (
              <button
                onClick={() => onViewDetails(p)}
                className="p-1 text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition-colors"
                title="Ver detalles"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
