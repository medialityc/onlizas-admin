"use client";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { PlatformAccount, GetPlatformAccounts } from "@/types/finance";
import { useCallback, useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";
import PlatformAccountCreateModal from "../modals/platform-account-create-modal";
import { PERMISSION_ENUM } from "@/lib/permissions";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { usePermissions } from "@/hooks/use-permissions";
import {
  toggleStatusPlatformAccount,
  getPlatformAccountById,
} from "@/services/finance/platform-accounts";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";

interface PlatformAccountsListProps {
  data?: GetPlatformAccounts;
}

export default function PlatformAccountsList({
  data,
}: PlatformAccountsListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  const createPlatformModal = getModalState("create");
  const editPlatformModal = getModalState("edit");
  const createPlatform = useCallback(() => openModal("create"), [openModal]);
  const [selectedAccount, setSelectedAccount] =
    useState<PlatformAccount | null>(null);

  const handleToggleActiveAccount = useCallback(
    async (account: PlatformAccount) => {
      if (!hasPermission([PERMISSION_ENUM.UPDATE])) {
        showToast("No tienes permisos para realizar esta acción", "error");
        return;
      }
      try {
        const res = await toggleStatusPlatformAccount(account.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
        } else {
          showToast(
            `Cuenta ${(res.data as any)?.active ? "activada" : "desactivada"} correctamente`,
            "success"
          );
          router.refresh();
        }
      } catch (e) {
        console.error(e);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [hasPermission, router]
  );

  const handleEditAccount = useCallback(
    async (account: PlatformAccount) => {
      if (!hasPermission([PERMISSION_ENUM.UPDATE])) {
        showToast("No tienes permisos para editar", "error");
        return;
      }
      try {
        const res = await getPlatformAccountById(account.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
          return;
        }
        setSelectedAccount(res.data as PlatformAccount);
        openModal("edit");
      } catch (e) {
        console.error(e);
        showToast("Error obteniendo datos de la cuenta", "error");
      }
    },
    [hasPermission, openModal]
  );

  const handleAfterSave = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleViewAccount = useCallback(
    (account: PlatformAccount) => {
      router.push(paths.finance.entityAccount(account.id));
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<PlatformAccount>[]>(
    () => [
      { accessor: "name", title: "Nombre" },
      { accessor: "accountNumber", title: "Cuenta" },
      { accessor: "purposeName", title: "Propósito" },
      { accessor: "bank", title: "Banco" },
      {
        accessor: "isMainAccount",
        title: "Principal",
        render: (r) => (
          <span
            className={r.isMainAccount ? "text-green-700" : "text-gray-600"}
          >
            {r.isMainAccount ? "Sí" : "No"}
          </span>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        render: (r) => (
          <span className={r.active ? "text-green-700" : "text-red-700"}>
            {r.active ? "Activa" : "Inactiva"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (account) => (
          <div className="flex justify-center">
            <ActionsMenu
              active={account.active}
              onActive={() => handleToggleActiveAccount(account)}
              onViewDetails={() => handleViewAccount(account)}
              onEdit={() => handleEditAccount(account)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [handleToggleActiveAccount, handleEditAccount, handleViewAccount]
  );

  return (
    <>
      <DataGrid<PlatformAccount>
        simpleData={data?.data || []}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        onCreate={createPlatform}
        createText="Nueva cuenta"
        createPermissions={[PERMISSION_ENUM.CREATE]}
        emptyText="Sin cuentas"
      />
      <PlatformAccountCreateModal
        open={createPlatformModal.open}
        onClose={() => closeModal("create")}
        onSuccess={handleAfterSave}
      />
      <PlatformAccountCreateModal
        open={editPlatformModal.open}
        onClose={() => {
          closeModal("edit");
          setSelectedAccount(null);
        }}
        onSuccess={handleAfterSave}
        account={selectedAccount || undefined}
      />
    </>
  );
}
