"use client";
import { Button } from "@/components/button/button";
import { useModalState } from "@/hooks/use-modal-state";
import { PlusIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import WarehouseSelectedModal from "../../containers/warehouse-transfer-modal";
import { useCallback, useMemo } from "react";
import CreateMeWarehouseModal from "../../containers/me-create-warehouse-modal";
import { getAllWarehousesByType } from "@/services/warehouses";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { MeWarehouseFormData } from "../../schemas/me-warehouse-schema";

type Props = {
  data: MeWarehouseFormData[];
};
const MeWarehouseHeader = ({ data }: Props) => {
  const { getModalState, openModal, closeModal } = useModalState();

  const editWarehouseModal = getModalState<number>("edit");

  const selectedWarehouse = useMemo(() => {
    const id = editWarehouseModal.id;
    if (!id || !data) return null;
    return data.find((warehouse) => warehouse.id == id);
  }, [editWarehouseModal.id, data]);

  const handleInitTransfer = useCallback(
    () => openModal("transfer"),
    [openModal],
  );

  const createWarehouseModal = getModalState("create");
  const handleOpen = () => {
    openModal("create");
  };
  const onCloseModal = () => {
    closeModal("create");
  };
  const transferModal = getModalState<number>("transfer");
  return (
    <>
      <div className="flex items-center justify-between gap-2 w-full">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Gestión de almacenes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra almacenes físicos y virtuales
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button onClick={handleInitTransfer} variant="secondary" outline>
            <ArrowsRightLeftIcon className="h-4 w-4 mr-2" /> Transferencias
          </Button>

          <Button onClick={handleOpen}>
            <PlusIcon className="h-4 w-4 mr-2" /> Nuevo almacén
          </Button>
        </div>
      </div>

      <WarehouseSelectedModal
        onClose={() => closeModal("transfer")}
        open={transferModal.open}
        getWarehouse={(params: any) =>
          getAllWarehousesByType(params, WAREHOUSE_TYPE_ENUM.virtualwarehouse)
        }
      />

      <CreateMeWarehouseModal
        open={createWarehouseModal.open}
        onClose={onCloseModal}
      />

      {/* Edit Modal */}
      {selectedWarehouse && (
        <CreateMeWarehouseModal
          onClose={() => closeModal("edit")}
          open={editWarehouseModal.open}
          warehouse={selectedWarehouse}
        />
      )}
    </>
  );
};

export default MeWarehouseHeader;
