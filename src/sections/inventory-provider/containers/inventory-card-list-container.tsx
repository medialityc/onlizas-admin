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
  hideCreate?: boolean;
  providerId?: string; // supplier id for supplier create mode
}

export default function InventoryCardListContainer({
  inventories: inventoriesResponse,
  query,
  hideCreate = false,
  providerId,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();

  // Modal states controlled by URL
  const createPermissionModal = getModalState("create");
  const handleOpen = () => {
    if (hideCreate) return; // prevent opening if not allowed
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
      <div>
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
          onCreate={hideCreate ? () => {} : handleOpen}
        />
        {!hideCreate && (
          <CreateInventoryModal
            open={createPermissionModal.open}
            onClose={onCloseModal}
            provider={providerId}
          />
        )}
      </div>
    </div>
  );
}
