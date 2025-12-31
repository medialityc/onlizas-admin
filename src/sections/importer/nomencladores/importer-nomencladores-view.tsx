"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@mantine/core";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useImporterData } from "@/contexts/importer-data-context";
import {
  ImporterNomenclator,
  updateImporterNomenclator,
  toggleImporterNomenclatorStatus,
} from "@/services/importer-portal";
import ActionsMenu from "@/components/menu/actions-menu";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFMultiSelectImporterCategories } from "@/components/react-hook-form";
import LoaderButton from "@/components/loaders/loader-button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import showToast from "@/config/toast/toastConfig";

interface Props {
  importerId: string;
  nomenclators: ImporterNomenclator[];
}

type NomenclatorForm = {
  name: string;
  categoryIds: string[];
};

export default function ImporterNomencladoresView({
  importerId,
  nomenclators,
}: Props) {
  const columns = useMemo<DataTableColumn<Nomenclator>[]>(
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
        accessor: "categories",
        title: "Categorías",
        render: (r) => {
          const categories = r.categories || [];
          return (
            <div className="flex flex-wrap gap-1">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Badge key={cat.id} size="sm" variant="light">
                    {cat.name}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400">-</span>
              )}
            </div>
          );
        },
      },
      {
        accessor: "createdAt",
        title: "Fecha de creación",
        render: (r) => {
          return r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("es-ES")
            : "-";
        },
      },
      {
        accessor: "isActive",
        title: "Estado",
        render: (r) => (
          <Badge color={r.isActive ? "green" : "gray"}>
            {r.isActive ? "Activo" : "Inactivo"}
          </Badge>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center">
            <ActionsMenu
              onEdit={() => openEdit(r)}
              onActive={() => handleToggleStatus(r)}
              active={r.isActive}
            />
          </div>
        ),
      },
    ],
    [openEdit, handleToggleStatus]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Nomencladores
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tipos de productos que pueden vender los proveedores de esta
          importadora
        </p>
      </div>

      <DataGrid<ImporterNomenclator>
        simpleData={localData}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        onCreate={openCreate}
        createText="Nuevo nomenclador"
        emptyText="No hay nomencladores registrados"
      />

      <SimpleModal
        open={opened}
        onClose={close}
        title={selected ? "Editar nomenclador" : "Nuevo nomenclador"}
      >
        <div className="p-5">
          <FormProvider
            methods={methods}
            onSubmit={submit}
            id="nomenclator-form"
          >
            <div className="space-y-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre del nomenclador"
                type="text"
                required
              />
              {!selected && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Nota:</strong> La creación de nuevos nomencladores
                    estará disponible próximamente.
                  </p>
                </div>
              )}
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
              <LoaderButton
                type="submit"
                loading={isSaving}
                disabled={isSaving || !selected}
              >
                Guardar
              </LoaderButton>
            </div>
          </FormProvider>
        </div>
      </SimpleModal>
    </div>
  );
}
