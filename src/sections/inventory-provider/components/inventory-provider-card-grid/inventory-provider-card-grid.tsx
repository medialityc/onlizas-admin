"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import InventoryProviderCardList from "../inventory-provider-card/inventory-provider-card-list";
import { GetAllInventoryProviderResponse } from "@/types/inventory";
import { useModalState } from "@/hooks/use-modal-state";
import CreateInventoryModal from "../../modal/create-inventory-modal";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  provider: { id: string; name: string };
}

export function InventoryProviderCardGrid({
  data,
  searchParams,
  provider,
  onSearchParamsChange,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();
  const createModal = getModalState("create");
  const handleOpen = () => {
    openModal("create");
  };
  const handleClose = () => {
    closeModal("create");
  };
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario..."
        onCreate={handleOpen}
        createText="Crear inventario"
        enableColumnToggle={false}
        component={
          <InventoryProviderCardList
            data={data?.data as any[]}
            searchParams={searchParams}
            openModal={handleOpen}
          />
        }
      />
      <CreateInventoryModal
        open={createModal.open}
        onClose={handleClose}
        provider={provider?.id as string}
      />
    </>
  );
}
