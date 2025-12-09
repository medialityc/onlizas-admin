"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { Zone, GetZones } from "@/types/zones";
import { useCallback, useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";
import ZoneModal from "../modals/zone-modal";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { deleteZone, getZoneById } from "@/services/zones";
import { useRouter } from "next/navigation";

interface ZonesListProps {
  data?: GetZones;
}

export default function ZonesList({ data }: ZonesListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const router = useRouter();

  const createModal = getModalState("create");
  const editModal = getModalState("edit");

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const handleCreate = useCallback(() => openModal("create"), [openModal]);

  const handleEdit = useCallback(
    async (zone: Zone) => {
      try {
        const res = await getZoneById(zone.id);
        if (res.error && res.message) {
          showToast(res.message, "error");
          return;
        }
        setSelectedZone(res.data as Zone);
        openModal("edit");
      } catch (e) {
        console.error(e);
        showToast("Error obteniendo datos de la zona", "error");
      }
    },
    [openModal]
  );

  const handleDelete = useCallback(
    async (zone: Zone) => {
      try {
        const res = await deleteZone(zone.id);
        if (res.error) {
          showToast(res.message || "Error al eliminar la zona", "error");
        } else {
          showToast("Zona eliminada correctamente", "success");
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

  const columns = useMemo<DataTableColumn<Zone>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        render: (r) => (
          <span className="font-medium">{r.name}</span>
        ),
      },
      {
        accessor: "districtsIds",
        title: "Distritos",
        render: (r) => (
          <span className="text-sm">
            {r.districtsIds.length} distrito{r.districtsIds.length !== 1 ? "s" : ""}
          </span>
        ),
      },
      {
        accessor: "deliveryAmount",
        title: "Costo de Entrega",
        render: (r) => (
          <span className="font-medium">${r.deliveryAmount.toFixed(2)}</span>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        render: (r) => (
          <span
            className={r.active ? "text-green-700 font-medium" : "text-red-500"}
          >
            {r.active ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        accessor: "createdDatetime",
        title: "Creado",
        render: (r) => new Date(r.createdDatetime).toLocaleDateString(),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (zone) => (
          <div className="flex justify-center gap-2">
            <ActionsMenu
              onEdit={() => handleEdit(zone)}
              onDelete={() => handleDelete(zone)}
            />
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <>
      <DataGrid<Zone>
        simpleData={data?.data || []}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        onCreate={handleCreate}
        createText="Agregar zona"
        emptyText="No hay zonas de entrega registradas"
      />

      <ZoneModal
        open={createModal.open}
        onClose={() => closeModal("create")}
        onSuccess={handleAfterSave}
      />

      <ZoneModal
        open={editModal.open}
        onClose={() => {
          closeModal("edit");
          setSelectedZone(null);
        }}
        onSuccess={handleAfterSave}
        zone={selectedZone}
      />
    </>
  );
}
