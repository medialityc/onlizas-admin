"use client";

import { useMemo, useState } from "react";
import { Badge, Group, Avatar, Text, Loader, Alert } from "@mantine/core";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContract } from "@/services/importer-portal";
import { useImporterData } from "@/contexts/importer-data-context";
import ActionsMenu from "@/components/menu/actions-menu";
import SimpleModal from "@/components/modal/modal";
import ContractDetailsModal from "./contract-details-modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFDatePicker from "@/components/react-hook-form/rhf-date-picker";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateImporterContract } from "@/services/importer-access";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";

interface Props {
  importerId: string;
}

type ContractForm = {
  endDate: Date;
};

export default function ImporterContratosView({ importerId }: Props) {
  const router = useRouter();
  const { importerData } = useImporterData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ImporterContract | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const contracts = importerData?.contracts || [];
  const nomenclators = importerData?.nomenclators || [];
  const isLoading = false; // Ya los datos vienen del contexto

  const methods = useForm<ContractForm>({
    defaultValues: {
      endDate: new Date(),
    },
  });

  const { reset } = methods;

  const handleViewDetails = (contract: ImporterContract) => {
    setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handleEdit = (contract: ImporterContract) => {
    setSelectedContract(contract);
    reset({
      endDate: contract.endDate ? new Date(contract.endDate) : new Date(),
    });
    setEditModalOpen(true);
  };

  const closeModal = () => {
    setEditModalOpen(false);
    setSelectedContract(null);
  };

  const onSubmit = async (values: ContractForm) => {
    if (!selectedContract) return;

    setIsSaving(true);
    try {
      // Enviar los nomenclatorIds actuales del contrato (no se modifican)
      const currentNomenclatorIds = selectedContract.nomenclators?.map(n => n.id) || [];
      
      const res = await updateImporterContract(selectedContract.id, {
        endDate: values.endDate.toISOString(),
        nomenclatorIds: currentNomenclatorIds,
      });

      if (res.error) {
        toast.error(res.message || "Error al actualizar el contrato");
        return;
      }

      toast.success("Contrato actualizado exitosamente");
      closeModal();
      router.refresh();
    } catch (error) {
      console.error("Error updating contract:", error);
      toast.error("Error al actualizar el contrato");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusConfig = (status: string): { label: string; color: string } => {
    const config: Record<string, { label: string; color: string }> = {
      PENDING: { label: "Pendiente", color: "yellow" },
      APPROVED: { label: "Aprobado", color: "green" },
      ACTIVE: { label: "Activo", color: "green" },
      REJECTED: { label: "Rechazado", color: "red" },
      EXPIRED: { label: "Expirado", color: "gray" },
      TERMINATED: { label: "Terminado", color: "gray" },
    };
    return config[status?.toUpperCase()] || { label: status, color: "gray" };
  };

  const columns = useMemo<DataTableColumn<ImporterContract>[]>(
    () => [
      {
        accessor: "approvalProcessUser.userName",
        title: "Nombre de Usuario",
        render: (r) => {
          const userName = r.approvalProcessUser?.userName || "Usuario Desconocido";
          const userEmail = r.approvalProcessUser?.userEmail || "";
          
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color="blue">
                {userName?.substring(0, 2).toUpperCase()}
              </Avatar>
              <div>
                <Text size="sm" fw={500} className="text-gray-900 dark:text-gray-100">
                  {userName}
                </Text>
                {userEmail && (
                  <Text size="xs" c="dimmed">
                    {userEmail}
                  </Text>
                )}
              </div>
            </Group>
          );
        },
      },
      {
        accessor: "nomenclators",
        title: "Nomencladores",
        width: 250,
        render: (r) => {
          const nomenclators = r.nomenclators || [];
          if (nomenclators.length === 0) {
            return <Text size="sm" c="dimmed">-</Text>;
          }
          
          const first3 = nomenclators.slice(0, 3).map(n => n.name).join(", ");
          const remaining = nomenclators.length - 3;
          
          return (
            <Text size="sm" c="dimmed" style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
              {first3}
              {remaining > 0 && ` y ${remaining} más`}
            </Text>
          );
        },
      },
      {
        accessor: "startDate",
        title: "Fecha de Inicio",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.startDate ? new Date(r.startDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) : "-"}
          </Text>
        ),
      },
      {
        accessor: "endDate",
        title: "Fecha de Fin",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.endDate ? new Date(r.endDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) : "-"}
          </Text>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        render: (r) => {
          const config = getStatusConfig(r.status);
          return (
            <Badge color={config.color} variant="filled" size="sm">
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewDetails(r)}
              onEdit={() => handleEdit(r)}
              viewPermissions={[]}
              editPermissions={[]}
            />
          </div>
        ),
      },
    ],
    [importerData?.nomenclators]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Contratos
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Visualiza y gestiona los contratos de la importadora
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      )}

      {!isLoading && contracts.length === 0 && (
        <Alert 
          icon={<InformationCircleIcon className="h-5 w-5" />} 
          title="No hay contratos" 
          color="blue"
          className="mb-4"
        >
          No se encontraron contratos asociados a esta importadora.
        </Alert>
      )}

      {!isLoading && contracts.length > 0 && (
        <DataGrid<ImporterContract>
          simpleData={contracts}
          columns={columns}
          enablePagination={false}
          enableSorting={true}
          enableSearch={false}
          emptyText="No hay contratos disponibles"
        />
      )}

      <ContractDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
      />

      <SimpleModal
        open={editModalOpen}
        onClose={closeModal}
        title="Editar Contrato"
      >
        <div className="p-5">
          {selectedContract && (
            <>
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Información del Contrato
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Usuario: </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedContract.approvalProcessUser?.userName || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Fecha de Inicio: </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedContract.startDate
                        ? new Date(selectedContract.startDate).toLocaleDateString("es-ES")
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Estado: </span>
                    <Badge
                      color={getStatusConfig(selectedContract.status).color}
                      variant="filled"
                      size="sm"
                    >
                      {getStatusConfig(selectedContract.status).label}
                    </Badge>
                  </div>
                </div>
              </div>

              <FormProvider methods={methods} onSubmit={onSubmit}>
                <div className="space-y-4">
                  <Alert
                    icon={<InformationCircleIcon className="h-5 w-5" />}
                    color="blue"
                    className="mb-4"
                  >
                    Los nomencladores asignados al contrato no se pueden modificar.
                  </Alert>

                  <RHFDatePicker
                    name="endDate"
                    label="Fecha de Fin"
                    containerClassName="w-full"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={closeModal}
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
            </>
          )}
        </div>
      </SimpleModal>
    </div>
  );
}
