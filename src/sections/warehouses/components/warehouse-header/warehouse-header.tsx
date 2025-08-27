import { Button } from "@/components/button/button";
import { useModalState } from "@/hooks/use-modal-state";
import { PlusIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { WarehouseCreateModal } from "../../modals/warehouse-create-modal";

const WarehouseHeader = () => {
  const { getModalState, openModal, closeModal } = useModalState();
  const createModal = getModalState("createWarehouse");
  const handleCreate = () => openModal("createWarehouse");

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
          <Button variant="secondary" outline>
            <ArrowsRightLeftIcon className="h-4 w-4 mr-2" /> Transferencias
          </Button>
          <Button onClick={handleCreate}>
            <PlusIcon className="h-4 w-4 mr-2" /> Nuevo almacén
          </Button>
        </div>
      </div>
      <WarehouseCreateModal
        open={createModal.open}
        onClose={() => closeModal("createWarehouse")}
      />
    </>
  );
};

export default WarehouseHeader;
