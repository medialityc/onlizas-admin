"use client";
import { Button } from "@/components/button/button";
import { useModalState } from "@/hooks/use-modal-state";
import { PlusIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import WarehouseSelectedModal from "../../containers/warehouse-transfer-modal";
import { useCallback } from "react";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

const WarehouseHeader = () => {
  const { getModalState, openModal, closeModal } = useModalState();

  const handleInitTransfer = useCallback(
    () => openModal("transfer"),
    [openModal]
  );

  const transferModal = getModalState<number>("transfer");

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasCreatePermission = hasPermission(["CREATE_ALL"]);
  const hasTransferPermission = hasPermission(["UPDATE_ALL"]);

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
          {hasTransferPermission && (
            <Button onClick={handleInitTransfer} variant="secondary" outline>
              <ArrowsRightLeftIcon className="h-4 w-4 mr-2" /> Transferencias
            </Button>
          )}
          {hasCreatePermission && (
            <Link href={"warehouses/new"}>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" /> Nuevo almacén
              </Button>
            </Link>
          )}
        </div>
      </div>

      <WarehouseSelectedModal
        onClose={() => closeModal("transfer")}
        open={transferModal.open}
      />
    </>
  );
};

export default WarehouseHeader;
