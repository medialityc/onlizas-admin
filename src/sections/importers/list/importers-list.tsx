"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { Importer, GetImporters } from "@/types/importers";
import { useCallback, useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";
import ImporterModal from "../modals/importer-modal";
import ImporterQRModal from "../modals/importer-qr-modal";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { getImporterById, toggleImporterStatus } from "@/services/importers";
import { useRouter } from "next/navigation";
import Badge from "@/components/badge/badge";
import { PERMISSION_ADMIN } from "@/lib/permissions";

interface ImportersListProps {
  data?: GetImporters;
}

export default function ImportersList({ data }: ImportersListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const router = useRouter();

  const createModal = getModalState("create");
  const editModal = getModalState("edit");
  const qrModal = getModalState("qr");

  const [selectedImporter, setSelectedImporter] = useState<Importer | null>(
    null
  );

  const handleCreate = useCallback(() => openModal("create"), [openModal]);

  const handleEdit = useCallback(
    async (importer: Importer) => {
      try {
        const res = await getImporterById(importer.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
          return;
        }
        setSelectedImporter(res.data as Importer);
        openModal("edit");
      } catch (e) {
        console.error(e);
        showToast("Error obteniendo datos de la importadora", "error");
      }
    },
    [openModal]
  );

  const handleShowQR = useCallback(
    (importer: Importer) => {
      setSelectedImporter(importer);
      openModal("qr");
    },
    [openModal]
  );

  const handleViewNomenclators = useCallback(
    (importer: Importer) => {
      router.push(`/dashboard/importadoras/${importer.id}/nomencladores`);
    },
    [router]
  );

  const handleViewContracts = useCallback(
    (importer: Importer) => {
      router.push(`/dashboard/importadoras/${importer.id}/contratos`);
    },
    [router]
  );

  const handleAfterSave = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleToggleStatus = useCallback(
    async (importer: Importer) => {
      try {
        const res = await toggleImporterStatus(importer.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
          return;
        }
        showToast(
          `Importadora ${importer.isActive ? "desactivada" : "activada"} exitosamente`,
          "success"
        );
        router.refresh();
      } catch (e) {
        console.error(e);
        showToast("Error al cambiar el estado de la importadora", "error");
      }
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<Importer>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        render: (r) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {r.name}
          </span>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        width: 180,
        render: (r) => (
          <div className="h-10 flex items-center">
            <Badge
              variant={r.isActive ? "outline-success" : "outline-secondary"}
            >
              {r.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        ),
      },
      {
        accessor: "createdAt",
        title: "Fecha de Creación",
        render: (r) =>
          new Date(r.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (importer) => (
          <div className="flex justify-center gap-2">
            <ActionsMenu
              onEdit={() => handleEdit(importer)}
              onNomenclators={() => handleViewNomenclators(importer)}
              onContracts={() => handleViewContracts(importer)}
              onGenerateQR={() => handleShowQR(importer)}
              onActive={() => handleToggleStatus(importer)}
              active={importer.isActive}
              nomenclatorsPermissions={PERMISSION_ADMIN}
              contractsPermissions={PERMISSION_ADMIN}
            />
          </div>
        ),
      },
    ],
    [handleEdit, handleViewNomenclators, handleViewContracts, handleShowQR]
  );

  return (
    <>
      <DataGrid<Importer>
        simpleData={data?.data || []}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        onCreate={handleCreate}
        createText="Nueva Importadora"
        emptyText="No hay importadoras registradas"
      />

      <ImporterModal
        open={createModal.open}
        onClose={() => closeModal("create")}
        onSuccess={handleAfterSave}
      />

      <ImporterModal
        open={editModal.open}
        onClose={() => {
          closeModal("edit");
          setSelectedImporter(null);
        }}
        onSuccess={handleAfterSave}
        importer={selectedImporter}
      />

      <ImporterQRModal
        open={qrModal.open}
        onClose={() => {
          closeModal("qr");
          setSelectedImporter(null);
        }}
        importer={selectedImporter}
      />
    </>
  );
}
