"use client";

import React, { useCallback, useMemo, useState } from "react";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import ActionsMenu from "@/components/menu/actions-menu";
import { approveContractRequest, rejectContractRequest } from "@/services/importer-contracts";
import showToast from "@/config/toast/toastConfig";
import { useRouter } from "next/navigation";
import SimpleModal from "@/components/modal/modal";
import InputWithLabel from "@/components/input/input-with-label";
import LoaderButton from "@/components/loaders/loader-button";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { useForm } from "react-hook-form";
import { getImporterNomenclators } from "@/services/importers";

type ImporterNomenclator = {
  id: string;
  name: string;
};

type ImporterContract = {
  id: string;
  importerId: string;
  importerName: string;
  supplierId: string;
  supplierName: string;
  startDate: string;
  endDate: string;
  status: string;
  importerNomenclators?: ImporterNomenclator[]; // Nomencladores del contrato
};

type Row = ImporterContract & {
  importerNomenclators: ImporterNomenclator[];
};

type ContractForm = {
  nomenclatorIds: string[];
  startDate: string;
  endDate: string;
};

// Función helper para convertir fecha ISO a formato YYYY-MM-DD
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return "";
  }
};

// Función helper para formatear fecha legible
const formatDateReadable = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return "-";
  }
};

// Mapeo de estados en inglés a español
const statusMap: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  ACTIVE: "Activo",
  EXPIRED: "Expirado",
  TERMINATED: "Terminado",
};

const getStatusLabel = (status: string): string => {
  return statusMap[status.toUpperCase()] || status;
};

type Props = {
  importerName: string;
  importerId: string;
  contracts: ImporterContract[];
  nomenclators: ImporterNomenclator[];
};

export default function ProvidersTableClient({
  importerName,
  importerId,
  contracts,
  nomenclators,
}: Props) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [statusModalOpened, setStatusModalOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState({ status: "" });
  const [localContracts, setLocalContracts] = useState<ImporterContract[]>(contracts);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<ContractForm>({
    defaultValues: {
      nomenclatorIds: [],
      startDate: "",
      endDate: "",
    },
  });

  const { reset } = methods;

  const rows = useMemo<Row[]>(
    () => localContracts.map((c) => ({ 
      ...c, 
      // Si el contrato no tiene nomencladores específicos, usar los de la importadora
      importerNomenclators: c.importerNomenclators || nomenclators 
    })),
    [localContracts, nomenclators]
  );

  const selected = useMemo(
    () => localContracts.find((c) => c.id === selectedId) || null,
    [localContracts, selectedId]
  );

  const openEdit = useCallback(
    (contract: ImporterContract) => {
      setSelectedId(contract.id);
      
      // Convertir las fechas del backend al formato YYYY-MM-DD para los inputs
      const formattedStartDate = formatDateForInput(contract.startDate);
      const formattedEndDate = formatDateForInput(contract.endDate);
      
      // Obtener los IDs de los nomencladores del contrato
      // Si el contrato no tiene nomencladores específicos, iniciar vacío
      const nomenclatorIds = contract.importerNomenclators?.map(n => n.id) || [];
      
      // Poblar el formulario con los datos del contrato
      reset({
        nomenclatorIds,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      
      setOpened(true);
    },
    [reset]
  );

  const close = useCallback(() => {
    setOpened(false);
    setSelectedId(null);
    reset({ nomenclatorIds: [], startDate: "", endDate: "" });
  }, [reset]);

  const handleChangeStatus = useCallback((contract: ImporterContract) => {
    setSelectedStatusId(contract.id);
    // Normalizar el estado a mayúsculas y limpiar espacios
    const normalizedStatus = contract.status ? contract.status.trim().toUpperCase() : "";
    setStatusForm({ status: normalizedStatus });
    setStatusModalOpened(true);
  }, []);

  const closeStatusModal = useCallback(() => {
    setStatusModalOpened(false);
    setSelectedStatusId(null);
    setStatusForm({ status: "" }); // Limpiar el formulario al cerrar
  }, []);
  const submitEditContract = useCallback(
    async (values: ContractForm) => {
      if (!selectedId) return;

      setIsSaving(true);
      try {
        // TODO: Aquí deberías llamar al endpoint para actualizar el contrato
        // Por ahora solo actualizamos el estado local
        setLocalContracts((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? {
                  ...c,
                  startDate: values.startDate,
                  endDate: values.endDate,
                }
              : c
          )
        );
        
        showToast("Contrato actualizado exitosamente", "success");
        router.refresh();
        close();
      } catch (error) {
        showToast("Error al actualizar el contrato", "error");
      } finally {
        setIsSaving(false);
      }
    },
    [selectedId, close, router]
  );
  const handleStatusSave = useCallback(async () => {
    if (!selectedStatusId || !statusForm.status) return;
    
    setIsLoading(true);
    try {
      let res;
      
      if (statusForm.status === "APPROVED") {
        res = await approveContractRequest(selectedStatusId);
      } else if (statusForm.status === "REJECTED") {
        res = await rejectContractRequest(selectedStatusId);
      } else {
        // Si es PENDING, cerrar sin hacer nada
        closeStatusModal();
        return;
      }
      
      if (res?.error) {
        showToast(res.message || "Error al actualizar el contrato", "error");
        return;
      }
      
      // Actualizar el estado local de la tabla
      setLocalContracts((prev) =>
        prev.map((contract) =>
          contract.id === selectedStatusId
            ? { ...contract, status: statusForm.status }
            : contract
        )
      );
      
      showToast(
        statusForm.status === "APPROVED" 
          ? "Contrato aprobado exitosamente" 
          : "Contrato rechazado exitosamente", 
        "success"
      );
      
      router.refresh();
      closeStatusModal();
    } catch (error) {
      showToast("Error al actualizar el estado del contrato", "error");
    } finally {
      setIsLoading(false);
    }
  }, [closeStatusModal, selectedStatusId, statusForm.status, router]);

  const fetchNomenclators = useCallback(
    async (params: any) => {
      return await getImporterNomenclators(importerId, params);
    },
    [importerId]
  );

  const columns = useMemo<DataTableColumn<Row>[]>(
    () => [
      {
        accessor: "approvalProcessName",
        title: "Proveedor",
        render: (row) => row.approvalProcessName || row.supplierName || "-",
      },
      {
        accessor: "importerNomenclators",
        title: "Nomencladores",
        width: 250,
        render: (row) => {
          if (!row.importerNomenclators || row.importerNomenclators.length === 0) {
            return <span>-</span>;
          }
          
          const maxToShow = 2;
          const total = row.importerNomenclators.length;
          const toShow = row.importerNomenclators.slice(0, maxToShow);
          const remaining = total - maxToShow;
          
          return (
            <div className="flex flex-col gap-1" title={row.importerNomenclators.map((n) => n.name).join(", ")}>
              {toShow.map((n, idx) => (
                <span key={idx} className="text-sm truncate block max-w-[220px]">
                  {n.name}
                </span>
              ))}
              {remaining > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  +{remaining} más
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessor: "status",
        title: "Estado del contrato",
        render: (row) => getStatusLabel(row.status),
      },
      {
        accessor: "validity",
        title: "Vigencia",
        render: (row) => {
          const start = formatDateReadable(row.startDate);
          const end = formatDateReadable(row.endDate);
          return `${start} - ${end}`;
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (row) => (
          <div className="flex justify-center">
            <ActionsMenu
              onEdit={() => openEdit(row)}
              onChangeStatus={() => handleChangeStatus(row)}
              changeStatusPermissions={[]}
            />
          </div>
        ),
      },
    ],
    [openEdit, handleChangeStatus]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Proveedores - {importerName}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Lista de contratos por proveedor
        </p>
      </div>

      <DataGrid<Row>
        simpleData={rows}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        emptyText="No hay contratos"
      />

      <SimpleModal
        open={opened}
        onClose={close}
        title="Editar contrato"
      >
        <div className="p-5">
          {selected ? (
            <FormProvider methods={methods} onSubmit={submitEditContract}>
              <p className="text-sm mb-4 dark:text-white font-medium">{selected.supplierName}</p>
              
              <div className="space-y-4">
                <RHFAutocompleteFetcherInfinity
                  name="nomenclatorIds"
                  label="Nomencladores"
                  placeholder="Seleccionar nomencladores..."
                  onFetch={fetchNomenclators}
                  objectValueKey="id"
                  objectKeyLabel="name"
                  queryKey={`importer-nomenclators-${importerId}`}
                  dropdownPosition="top"
                  multiple
                  required
                />
                
                <RHFInputWithLabel
                  name="startDate"
                  label="Fecha de inicio"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  required
                />
                
                <RHFInputWithLabel
                  name="endDate"
                  label="Fecha de fin"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={close}
                  disabled={isSaving}
                  className="btn btn-outline-secondary"
                >
                  Cancelar
                </button>
                <LoaderButton type="submit" loading={isSaving} disabled={isSaving}>
                  Guardar
                </LoaderButton>
              </div>
            </FormProvider>
          ) : null}
        </div>
      </SimpleModal>

      <SimpleModal
        open={statusModalOpened}
        onClose={closeStatusModal}
        title="Cambiar estado del contrato"
      >
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="contractStatus" className="block text-sm font-medium mb-2 dark:text-white-light">
                Estado del contrato
              </label>
              <select
                id="contractStatus"
                value={statusForm.status}
                onChange={(e) => setStatusForm({ status: e.target.value })}
                className="form-select"
              >
                <option value="">Selecciona un estado</option>
                <option value="PENDING">Pendiente</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={closeStatusModal}
              disabled={isLoading}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
            <LoaderButton
              type="button"
              onClick={handleStatusSave}
              loading={isLoading}
              disabled={isLoading || !statusForm.status}
            >
              Guardar
            </LoaderButton>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
