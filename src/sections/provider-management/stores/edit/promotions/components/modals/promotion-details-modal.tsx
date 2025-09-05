import React from "react";
import type { Promotion } from "@/types/promotions";
import SimpleModal from "@/components/modal/modal";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { getPromotionTypeName, getDiscountText } from "../../utils/promotion-helpers";

interface PromotionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  promotion: Promotion | null;
}

export default function PromotionDetailsModal({ open, onClose, promotion }: PromotionDetailsModalProps) {
  if (!promotion) return null;

  const isExpired = promotion.endDate && new Date(promotion.endDate) < new Date();
  const isActive = promotion.isActive && !isExpired;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <SimpleModal open={open} onClose={onClose} title="Detalles de la Promoción" className="max-w-4xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{promotion.name}</h2>
              {promotion.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{promotion.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isActive && (
                <Badge variant="outline-success" rounded className="px-3 py-1">
                  ✓ Activa
                </Badge>
              )}
              {isExpired && (
                <Badge variant="outline-danger" rounded className="px-3 py-1">
                  ⏰ Vencida
                </Badge>
              )}
              {!promotion.isActive && !isExpired && (
                <Badge variant="outline-secondary" rounded className="px-3 py-1">
                  ⏸️ Inactiva
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Information */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Información General
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Promoción</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {getPromotionTypeName(promotion.promotionType)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Código</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {promotion.code || 'Sin código'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descuento</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {getDiscountText(promotion.discountType, promotion.discountValue)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Límite de uso</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {promotion.usageLimit ? promotion.usageLimit.toLocaleString() : 'Sin límite'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usos actuales</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {promotion.usedCount?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates and Store */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fechas y Tienda
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha inicio</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {promotion.startDate ? formatDateTime(promotion.startDate) : 'No especificada'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha fin</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {promotion.endDate ? formatDateTime(promotion.endDate) : 'Sin fecha fin'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tienda</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {promotion.storeName || 'Tienda no especificada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {promotion.promotionCategoriesDTOs && promotion.promotionCategoriesDTOs.length > 0 && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Categorías Aplicables ({promotion.promotionCategoriesDTOs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {promotion.promotionCategoriesDTOs.map((category: any) => (
                <Badge key={category.id} variant="outline-primary" rounded className="px-3 py-1">
                  {category.categoryName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {promotion.promotionProductsDTOs && promotion.promotionProductsDTOs.length > 0 && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Productos Aplicables ({promotion.promotionProductsDTOs.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {promotion.promotionProductsDTOs.map((product: any, index: number) => {
                // Determinar qué nombre mostrar
                const displayName = product.productName || 
                                  product.productVariantName || 
                                  product.name || 
                                  `Producto ID: ${product.productVariantId}`;
                
                const hasVariantInfo = product.productVariantName && product.productName && 
                                     product.productVariantName !== product.productName;
                
                return (
                  <div
                    key={`${product.productVariantId}-${index}`}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:border-orange-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {displayName}
                          </p>
                          {hasVariantInfo && (
                            <p className="text-xs text-gray-600 mt-1 italic">
                              Variante: {product.productVariantName}
                            </p>
                          )}
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                          ID: {product.productVariantId}
                        </span>
                      </div>
                      
                      {/* Información adicional si está disponible */}
                      {(product.sku || product.price || product.stock) && (
                        <div className="pt-2 border-t border-gray-200 space-y-1">
                          {product.sku && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">SKU:</span> {product.sku}
                            </p>
                          )}
                          {product.price && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Precio:</span> ${product.price}
                            </p>
                          )}
                          {product.stock !== undefined && (
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Stock:</span> {product.stock}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Mensaje informativo si no hay nombres disponibles */}
            {promotion.promotionProductsDTOs.some((p: any) => !p.productName && !p.productVariantName && !p.name) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">💡 Nota:</span> Algunos productos solo muestran ID porque los nombres no están disponibles en la respuesta del servidor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Image Section */}
        {promotion.mediaFile && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
              Imagen de la Promoción
            </h3>
            <div className="flex justify-center">
              <img
                src={promotion.mediaFile}
                alt={`Imagen de ${promotion.name}`}
                className="max-w-full max-h-64 object-contain rounded-lg border shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t bg-gray-50 -m-2 p-4 rounded-b-lg">
          <Button
            onClick={onClose}
            className="px-6 py-2"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
}
