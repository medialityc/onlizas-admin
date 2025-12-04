"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { SupplierAccount, GetSupplierAccounts } from "@/types/finance";
import { useCallback, useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";
import SupplierAccountModal from "../modals/supplier-account-modal";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import {
  deleteSupplierAccount,
  setSupplierAccountPrimary,
  getSupplierAccountById,
} from "@/services/finance/supplier-accounts";
import { useRouter } from "next/navigation";

interface SupplierAccountsListProps {
  data?: GetSupplierAccounts;
  supplierId: string;
}

export default function SupplierAccountsList({
  data,
  supplierId,
}: SupplierAccountsListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const router = useRouter();

  const createModal = getModalState("create");
  const editModal = getModalState("edit");

  const [selectedAccount, setSelectedAccount] =
    useState<SupplierAccount | null>(null);

  const handleCreate = useCallback(() => openModal("create"), [openModal]);

  const handleSetPrimary = useCallback(
    async (account: SupplierAccount) => {
      try {
        const res = await setSupplierAccountPrimary(account.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
        } else {
          showToast("Cuenta marcada como principal", "success");
          router.refresh();
        }
      } catch (e) {
        console.error(e);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [router]
  );

  const handleEdit = useCallback(
    async (account: SupplierAccount) => {
      try {
        const res = await getSupplierAccountById(account.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
          return;
        }
        setSelectedAccount(res.data as SupplierAccount);
        openModal("edit");
      } catch (e) {
        console.error(e);
        showToast("Error obteniendo datos de la cuenta", "error");
      }
    },
    [openModal]
  );

  const handleDelete = useCallback(
    async (account: SupplierAccount) => {
      try {
        const res = await deleteSupplierAccount(account.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
        } else {
          showToast("Cuenta eliminada correctamente", "success");
          router.refresh();
        }
      } catch (e) {
        console.error(e);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [router]
  );

  const handleAfterSave = useCallback(() => {
    router.refresh();
  }, [router]);

  const columns = useMemo<DataTableColumn<SupplierAccount>[]>(
    () => [
      { accessor: "name", title: "Nombre" },
      { accessor: "accountNumber", title: "Número de cuenta" },
      { accessor: "bank", title: "Banco" },
      {
        accessor: "isPrimaryAccount",
        title: "Principal",
        render: (r) => (
          <span className={r.isPrimaryAccount ? "text-green-700 font-medium" : "text-gray-500"}>
            {r.isPrimaryAccount ? "Sí" : "No"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (account) => (
          <div className="flex justify-center gap-2">
            {!account.isPrimaryAccount && (
              <button
                onClick={() => handleSetPrimary(account)}
                className="btn btn-sm btn-outline-primary"
                title="Marcar como principal"
              >
                Hacer principal
              </button>
            )}
            <ActionsMenu
              onEdit={() => handleEdit(account)}
              onDelete={() => handleDelete(account)}
            />
          </div>
        ),
      },
    ],
    [handleSetPrimary, handleEdit, handleDelete]
  );

  return (
    <>
      <DataGrid<SupplierAccount>
        simpleData={data?.data || []}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        onCreate={handleCreate}
        createText="Agregar cuenta"
        emptyText="No tienes cuentas bancarias registradas"
      />

      <SupplierAccountModal
        open={createModal.open}
        onClose={() => closeModal("create")}
        onSuccess={handleAfterSave}
        supplierId={supplierId}
      />

      <SupplierAccountModal
        open={editModal.open}
        onClose={() => {
          closeModal("edit");
          setSelectedAccount(null);
        }}
        onSuccess={handleAfterSave}
        account={selectedAccount}
        supplierId={supplierId}
      />
    </>
  );
}
