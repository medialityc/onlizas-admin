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
  providerId?: string; // s
  // upplier id for supplier create mode
  forProvider?: boolean;
}

export default function InventoryCardListContainer({
  inventories: inventoriesResponse,
  query,
  hideCreate = false,
  providerId,
  forProvider,
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Inventarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los inventarios del sistema y sus datos asociados
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
          forProvider={forProvider}
          open={createPermissionModal.open}
          onClose={onCloseModal}
          provider={providerId}
        />
      )}
    </div>
  );
}
