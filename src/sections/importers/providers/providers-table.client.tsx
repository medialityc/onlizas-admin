"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Modal, Button, Group, Text, TextInput } from "@mantine/core";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";

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
};

type Row = ImporterContract & {
  importerNomenclators: ImporterNomenclator[];
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
  const [opened, setOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ status: "", startDate: "", endDate: "" });
  const [localContracts, setLocalContracts] = useState<ImporterContract[]>(contracts);

  const rows = useMemo<Row[]>(
    () => localContracts.map((c) => ({ ...c, importerNomenclators: nomenclators })),
    [localContracts, nomenclators]
  );

  const selected = useMemo(
    () => localContracts.find((c) => c.id === selectedId) || null,
    [localContracts, selectedId]
  );

  const openEdit = useCallback(
    (contract: ImporterContract) => {
      setSelectedId(contract.id);
      setForm({
        status: contract.status || "",
        startDate: contract.startDate || "",
        endDate: contract.endDate || "",
      });
      setOpened(true);
    },
    []
  );

  const close = useCallback(() => {
    setOpened(false);
    setSelectedId(null);
  }, []);

  const save = useCallback(() => {
    if (!selectedId) return;

    setLocalContracts((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              status: form.status,
              startDate: form.startDate,
              endDate: form.endDate,
            }
          : c
      )
    );
    void importerId;

    close();
  }, [close, form.endDate, form.startDate, form.status, importerId, selectedId]);

  const columns = useMemo<DataTableColumn<Row>[]>(
    () => [
      {
        accessor: "supplierName",
        title: "Proveedor",
      },
      {
        accessor: "importerNomenclators",
        title: "Nomencladores",
        render: (row) =>
          row.importerNomenclators && row.importerNomenclators.length > 0
            ? row.importerNomenclators.map((n) => n.name).join(", ")
            : "-",
      },
      {
        accessor: "status",
        title: "Estado del contrato",
      },
      {
        accessor: "validity",
        title: "Vigencia",
        render: (row) => {
          const s = row.startDate
            ? new Date(row.startDate).toLocaleDateString("es-ES")
            : "-";
          const e = row.endDate
            ? new Date(row.endDate).toLocaleDateString("es-ES")
            : "-";
          return `${s} - ${e}`;
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (row) => (
          <div className="flex justify-center">
            <Button size="xs" onClick={() => openEdit(row)}>
              Editar
            </Button>
          </div>
        ),
      },
    ],
    [openEdit]
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

      <Modal opened={opened} onClose={close} title="Editar contrato" size="lg">
        {selected ? (
          <>
            <Text mb="sm">{selected.supplierName}</Text>
            <TextInput
              label="Estado"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
            <TextInput
              label="Vigencia inicio"
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
            <TextInput
              label="Vigencia fin"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
            <Group justify="right" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button onClick={save}>Guardar</Button>
            </Group>
          </>
        ) : null}
      </Modal>
    </div>
  );
}
