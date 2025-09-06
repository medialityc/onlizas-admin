"use client";

import { Store } from "@/types/stores";
import { toast } from "react-toastify";

// Hooks refactorizados
import { usePromotionsData } from "./hooks/usePromotionsData";
import { usePromotionsMutations } from "./hooks/mutations/usePromotionsMutations";
import { usePromotionFilters } from "./hooks/usePromotionFilters";
import { usePromotionModals } from "./hooks/usePromotionModals";
import { useInitialLoading } from "./hooks/useInitialLoading";
import { useRouter } from "next/navigation";

// Componentes refactorizados
import PromotionsMetrics from "./components/promotions-metrics";
import PromotionsToolbar from "./components/toolbar";
import PromotionFilters from "./components/promotion-filters";
import PromotionList from "./components/promotion-list";
import { Pagination } from "../../list/components/pagination";

// Modales
import PromotionTypeSelectorModal from "./components/modals/promotion-type-selector-modal";
import PromotionDetailsModal from "./components/modals/promotion-details-modal";
import DeleteDialog from "@/components/modal/delete-modal";

interface Props {
  store: Store;
}

/**
 * Contenedor principal refactorizado
 * - Separación clara de responsabilidades
 * - Hooks especializados
 * - Componentes más pequeños y reutilizables
 * - Preparado para múltiples tipos de promociones
 */
export default function PromotionsContainer({ store }: Props) {
  // Hooks especializados
  const filters = usePromotionFilters({ page: 1, pageSize: 10 });
  const data = usePromotionsData(store.id, filters.searchParams);
  const mutations = usePromotionsMutations(store.id);
  const modals = usePromotionModals();
  const router = useRouter();
  const loading = useInitialLoading(data.isLoading);

  // Handlers del contenedor
  const handleConfirmDelete = () => {
    if (modals.promotionToDelete != null) {
      mutations.deletePromotion(modals.promotionToDelete);
      modals.closeDeleteModal();
    } else {
      toast.error("ID de promoción inválido, no se pudo eliminar.");
    }
  };

  // Loading inicial completo
  if (loading.isInitialLoad) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-300" />
      </div>
    );
  }

  // wrapper class 'store-promotions-inner' para estilos específicos de la vista
  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100 store-promotions-inner">
      {/* Métricas globales */}
      <PromotionsMetrics
        total={data.metrics.total}
        active={data.metrics.active}
        uses={data.metrics.uses}
        expired={data.metrics.expired}
      />

      {/* Toolbar con botón crear */}
      <PromotionsToolbar onNew={modals.openCreateModal} />

      {/* Filtros y búsqueda */}
      <PromotionFilters
        filterStatus={filters.filterStatus}
        searchValue={filters.localSearchValue}
        onFilterChange={filters.handleFilterChange}
        onSearchChange={filters.handleSearch}
      />

      {/* Lista de promociones */}
      <div className="min-h-[200px]">
        <PromotionList
          promotions={data.promotions}
          isLoading={loading.isRefetching}
          onEdit={(p) => {
            // Guardar path actual antes de navegar
            if (typeof window !== "undefined") {
              localStorage.setItem('promotionFormBackPath', window.location.pathname + window.location.search);
            }
            router.push(`/stores/${store.id}/promotions/${p.id}/edit`);
          }}
          onDelete={modals.openDeleteModal}
          onViewDetails={modals.openDetailsModal}
        />
      </div>

      {/* Paginación */}
      <Pagination
        page={filters.searchParams.page || 1}
        pageSize={filters.searchParams.pageSize || 10}
        totalRecords={data.totalCount}
        onPageChange={filters.handlePageChange}
        onPageSizeChange={filters.handlePageSizeChange}
      />

      {/* Modal de selección de tipo de promoción */}
      <PromotionTypeSelectorModal
        open={modals.createModalOpen}
        onClose={modals.closeCreateModal}
      />

      {/* Modal de detalles */}
      <PromotionDetailsModal
        open={modals.detailsModalOpen}
        onClose={modals.closeDetailsModal}
        promotion={modals.selectedPromotion}
      />

      {/* Modal de eliminación */}
      <DeleteDialog
        open={modals.deleteModalOpen}
        onClose={modals.closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar promoción?"
        description="Esta acción eliminará permanentemente la promoción y no se puede deshacer."
        warningMessage="Los datos de uso de esta promoción se perderán."
        loading={mutations.isDeleting}
      />
    </div>
  );
}
