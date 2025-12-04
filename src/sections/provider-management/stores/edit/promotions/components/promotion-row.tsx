import type { Promotion } from "@/types/promotions";
import Badge from "@/components/badge/badge";
import {
  PencilIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { getPromotionTypeName } from "../index-refactored";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePromotionStatus } from "@/services/promotions";
import { toast } from "react-toastify";

interface PromotionRowProps {
  p: Promotion;
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (id: number) => void;
  onViewDetails?: (promotion: Promotion) => void;
}

export default function PromotionRow({
  p,
  onEdit,
  onDelete,
  onViewDetails,
}: PromotionRowProps) {
  const isExpired = p.endDate && new Date(p.endDate) < new Date();
  const queryClient = useQueryClient();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);

  // Mutation para toggle status
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const res = await togglePromotionStatus(p.id);
      if (res.error) {
        throw new Error(res.message || "Error al cambiar estado");
      }
      return res;
    },
    onSuccess: () => {
      // Invalidar tanto las promociones como el summary para las métricas
      queryClient.invalidateQueries({
        queryKey: ["store-promotions"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["store-promotions-summary"],
        exact: false,
      });
      toast.success(
        `Promoción ${p.active ? "desactivada" : "activada"} exitosamente`
      );
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al cambiar estado de la promoción");
    },
  });

  const getDiscountText = (type: number, value: number) => {
    // Backend: 1=Porcentaje, 2=MontoFijo, 3=EnvíoGratis, 4=CompraXLlevaY
    switch (type) {
      case 1: // Porcentaje
        return `-${value}%`;
      case 2: // MontoFijo
        return `-$${value}`;
      case 3: // EnvíoGratis
        return "Envío Gratis";
      case 4: // CompraXLlevaY
        return "Compra X Lleva Y";
      default:
        return `-${value}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
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
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {p.name}
            </h4>
            {p.active && !isExpired && (
              <Badge
                variant="outline-primary"
                className="!text-[11px] !px-2 !py-0.5"
                rounded
              >
                Activa
              </Badge>
            )}
            {isExpired && (
              <Badge
                variant="outline-danger"
                className="!text-[11px] !px-2 !py-0.5"
                rounded
              >
                Vencida
              </Badge>
            )}
            {!p.active && !isExpired && (
              <Badge
                variant="outline-secondary"
                className="!text-[11px] !px-2 !py-0.5"
                rounded
              >
                Inactiva
              </Badge>
            )}
          </div>
          {p.description && (
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {p.description}
            </p>
          )}
          <span className="text-xs font-normal text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            Tipo: {getPromotionTypeName(p.promotionType)}
          </span>

          <div className="text-[11px] text-gray-500 mt-1">
            {p.code ? <span className="font-medium">{p.code}</span> : null}
            {p.startDate && p.endDate ? (
              <span className="ml-2 dark:text-gray-300">
                {formatDate(p.startDate)} - {formatDate(p.endDate)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {getDiscountText(p.discountType, p.discountValue)}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-300">
              {p.usedCount ?? 0} usos
            </div>
          </div>

          {/* Toggle Switch para estado activo/inactivo */}
          {hasUpdatePermission && !isExpired && (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleMutation.mutate()}
                disabled={toggleMutation.isPending}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 ${
                  p.active ? "bg-blue-600" : "bg-gray-200"
                }`}
                title={`${p.active ? "Desactivar" : "Activar"} promoción`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    p.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-[10px] text-gray-500 dark:text-gray-300">
                {p.active ? "Activa" : "Inactiva"}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Botón editar temporalmente oculto */}
            {/* {onEdit && hasUpdatePermission && (
              <button
                onClick={() => onEdit(p)}
                className="p-1 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition-colors"
                title="Editar promoción"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )} */}

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
