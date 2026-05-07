"use client";

import SimpleModal from "@/components/modal/modal";
import { InventoryReview } from "@/types/reviews";
import { RatingStars } from "@/components/ui/rating-stars";
import Badge from "@/components/badge/badge";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface ReviewDetailsModalProps {
  review: InventoryReview | null;
  open: boolean;
  onClose: () => void;
}

export function ReviewDetailsModal({
  review,
  open,
  onClose,
}: ReviewDetailsModalProps) {
  if (!review) return null;

  return (
    <SimpleModal
      title="Detalles de la Reseña"
      open={open}
      onClose={onClose}
      size="md"
    >
      <div className="space-y-5 p-1">
        {/* Usuario y Promedio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Usuario
            </label>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {review.userName}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Promedio
            </label>
            <div className="text-sm">
              <RatingStars value={review.averageScore} size="sm" showValue />
            </div>
          </div>
        </div>

        {/* Puntuaciones detalladas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Calidad del Producto
            </label>
            <RatingStars value={review.productQuality} size="sm" showValue />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Calidad del Proveedor
            </label>
            <RatingStars value={review.supplierQuality} size="sm" showValue />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Calidad de Entrega
            </label>
            <RatingStars value={review.deliveryQuality} size="sm" showValue />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Estado
          </label>
          <div className="text-sm">
            <Badge variant={review.active ? "outline-success" : "outline-secondary"}>
              {review.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        {/* Mensaje completo */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Mensaje
          </label>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {review.message || "—"}
          </p>
        </div>

        {/* Media */}
        {review.media && review.media.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Media adjunta
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <PhotoIcon className="h-5 w-5" />
              <span>{review.media.length} archivo(s)</span>
            </div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {review.media.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Botón cerrar */}
        <div className="mt-4 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
