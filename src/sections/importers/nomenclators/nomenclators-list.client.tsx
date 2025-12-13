"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterNomenclator } from "@/types/importers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@mantine/core";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import ActionsMenu from "@/components/menu/actions-menu";
import { getAllCategories } from "@/services/categories";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createNomenclator,
  getNomenclatorById,
  updateNomenclator,
} from "@/services/nomenclators";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";

interface Props {
  data: ImporterNomenclator[];
  importerName: string;
  importerId: string;
}

type NomenclatorForm = {
  name: string;
  categoryIds: string[];
};

export default function NomenclatorsListClient({
  data,
  importerName,
  importerId,
}: Props) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<ImporterNomenclator | null>(null);
  const [localData, setLocalData] = useState<ImporterNomenclator[]>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({});

  const methods = useForm<NomenclatorForm>({
    defaultValues: {
      name: "",
      categoryIds: [],
    },
  });

  const { reset } = methods;

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const openCreate = useCallback(() => {
    setSelected(null);
    reset({ name: "", categoryIds: [] });
    setOpened(true);
  }, [reset]);

  const openEdit = useCallback((n: ImporterNomenclator) => {
    setSelected(n);
    reset({
      name: n.name || "",
      categoryIds: [],
    });
    setOpened(true);

    (async () => {
      const res = await getNomenclatorById(n.id);
      if (res.error || !res.data) {
        return;
      }

      const ids = (res.data.categories || []).map((c) => c.id);
      const labels = (res.data.categories || []).reduce<Record<string, string>>(
        (acc, c) => {
          acc[c.id] = c.name;
          return acc;
        },
        {}
      );
      setCategoryLabels((prev) => ({ ...prev, ...labels }));
      reset({
        name: res.data.name || n.name || "",
        categoryIds: ids,
      });
    })();
  }, [getNomenclatorById, reset]);

  const close = useCallback(() => {
    setOpened(false);
    setSelected(null);
  }, []);

  const submit = useCallback(
    async (values: NomenclatorForm) => {
      const name = values.name.trim();
      if (!name) return;

      setIsSaving(true);
      try {
        if (selected) {
          const res = await updateNomenclator(selected.id, {
            name,
            categoryIds: values.categoryIds || [],
          });
          if (res.error) {
            toast.error(res.message || "Error actualizando nomenclador");
            return;
          }

          setLocalData((prev) =>
            prev.map((n) =>
              n.id === selected.id
                ? {
                    ...n,
                    name,
                    categories: values.categoryIds || [],
                  }
                : n
            )
          );
          toast.success("Nomenclador actualizado correctamente");
          router.refresh();
        } else {
          const res = await createNomenclator({
            name,
            importerId,
            categoryIds: values.categoryIds || [],
          });
          if (res.error) {
            toast.error(res.message || "Error creando nomenclador");
            return;
          }

          const createdAt = new Date().toISOString();
          setLocalData((prev) => [
            {
              id: (res.data as any)?.id || `temp-${createdAt}`,
              name,
              isActive: (res.data as any)?.isActive ?? true,
              createdAt: (res.data as any)?.createdAt || createdAt,
              categories: values.categoryIds || [],
            },
            ...prev,
          ]);
          toast.success("Nomenclador creado correctamente");
          router.refresh();
        }

        close();
      } catch {
        toast.error("Ocurrió un error, intente nuevamente");
      } finally {
        setIsSaving(false);
      }
    },
    [close, importerId, router, selected]
  );

  const columns = useMemo<DataTableColumn<ImporterNomenclator>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        render: (r) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{r.name}</span>
        ),
      },
      {
        accessor: "categories",
        title: "Categorías",
        render: (r) => {
          const categories = r.categories || [];
          return (
            <div className="flex flex-wrap gap-1">
              {categories.length > 0
                ? categories.map((cat: any, idx: number) => (
                    <Badge key={idx} size="sm" variant="light">
                      {typeof cat === 'object' && cat?.name ? cat.name : (categoryLabels[String(cat)] || String(cat))}
                    </Badge>
                  ))
                : "-"}
            </div>
          );
        },
      },
      {
        accessor: "createdAt",
        title: "Fecha de creación",
        render: (r) => {
          const d = r.createdAt || r.createdDatetime;
          return d ? new Date(d).toLocaleDateString("es-ES") : "-";
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
            <ActionsMenu onEdit={() => openEdit(r)} />
          </div>
        ),
      },
    ],
    [categoryLabels, openEdit]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Nomencladores - {importerName}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tipos de productos que pueden vender los proveedores de esta importadora
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
          <FormProvider methods={methods} onSubmit={submit} id="nomenclator-form">
            <div className="space-y-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre del nomenclador"
                type="text"
                required
              />
              <RHFAutocompleteFetcherInfinity
                name="categoryIds"
                label="Categorías"
                placeholder="Seleccionar categorías..."
                onFetch={getAllCategories}
                objectValueKey="id"
                objectKeyLabel="name"
                queryKey="categories"
                dropdownPosition="top"
                multiple
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
        </div>
      </SimpleModal>
    </div>
  );
}
