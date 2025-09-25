"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { InventoryCardGrid } from "../components/inventory-provider-card-grid/inventory-card-grid";
import { useModalState } from "@/hooks/use-modal-state";
import CreateInventoryModal from "../modal/create-inventory-modal";
import { GetAllInventoryProviderResponse } from "@/types/inventory";

interface Props {
  inventories: ApiResponse<GetAllInventoryProviderResponse>;
  query: SearchParams;
}

export default function InventoryCardListContainer({
  inventories: inventoriesResponse,
  query,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();

  // Modal states controlled by URL
  const createPermissionModal = getModalState("create");
  const handleOpen = () => {
    openModal("create");
  };
  const onCloseModal = () => {
    closeModal("create");
  };
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-start gap-2">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Inventarios
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestión de inventario
            </p>
          </div>
        </div>

        <InventoryCardGrid
          data={inventoriesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          onCreate={handleOpen}
        />
        <CreateInventoryModal
          open={createPermissionModal.open}
          onClose={onCloseModal}
        />
      </div>
    </div>
  );
}
