"use client";

import SimpleModal from "@/components/modal/modal";
import { useQuery } from "@tanstack/react-query";
import { getBrandById } from "@/services/brands";
import { Brand } from "@/types/brands";

interface BrandDetailsModalProps {
  brandId: string;
  open: boolean;
  onClose: () => void;
  fallbackBrand?: Brand | null; // brand from list to avoid refetch
}

export function BrandDetailsModal({
  brandId,
  open,
  onClose,
  fallbackBrand,
}: BrandDetailsModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brand", brandId],
    queryFn: async () => {
      // If we already have the brand from the list, return it directly
      if (fallbackBrand) return fallbackBrand;
      const res = await getBrandById(brandId);
      if (res.error || !res.data) throw new Error(res.message || "Error");
      return res.data as Brand;
    },
    enabled: open && !!brandId && !fallbackBrand, // don't fetch if fallback provided
    initialData: fallbackBrand,
  });

  return (
    <SimpleModal title="Detalles de la Marca" open={open} onClose={onClose}>
      <div className="space-y-4 p-1">
        {isLoading && !data && (
          <p className="text-sm text-gray-500">Cargando...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">
            No se pudieron cargar los detalles.
          </p>
        )}
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nombre
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.name}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Productos asociados
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {data.productsCount}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
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
