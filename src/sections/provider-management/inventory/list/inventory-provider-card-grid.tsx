"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { GetAllInventoryProviderResponse } from "@/types/inventory";
import { useModalState } from "@/hooks/use-modal-state";
import { IUser, IUserResponseMe } from "@/types/users";
import CreateInventoryModal from "@/sections/inventory-provider/modal/create-inventory-modal";
import InventoryProviderCardList from "./inventory-provider-card-list";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  provider?: IUser | IUserResponseMe;
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
        rightActions={<></>}
        component={
          <InventoryProviderCardList
            data={data?.data}
            searchParams={searchParams}
            openModal={handleOpen}
          />
        }
      />
      <CreateInventoryModal
        open={createModal.open}
        onClose={handleClose}
        provider={provider?.id}
      />
    </>
  );
}
