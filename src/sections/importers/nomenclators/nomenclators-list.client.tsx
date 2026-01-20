"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterNomenclatorDetail } from "@/types/importers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@mantine/core";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFMultiSelectImporterCategories from "@/components/react-hook-form/rhf-multi-select-importer-categories";
import ActionsMenu from "@/components/menu/actions-menu";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getAllCategories } from "@/services/categories";
import {
  createNomenclator,
  getNomenclatorById,
  updateNomenclator,
  toggleNomenclatorStatus,
} from "@/services/nomenclators";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";

interface Props {
  data: ImporterNomenclatorDetail[];
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
  const [selected, setSelected] = useState<ImporterNomenclatorDetail | null>(null);
  const [localData, setLocalData] = useState<ImporterNomenclatorDetail[]>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

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

  const openCreate = useCallback(async () => {
    setSelected(null);
    reset({ name: "", categoryIds: [] });
    setOpened(true);
    
    // Cargar categorías si no están cargadas
    if (categories.length === 0 && !loadingCategories) {
      setLoadingCategories(true);
      try {
        const response = await getAllCategories({ page: 1, pageSize: 1000 });
        if (!response.error && response.data?.data) {
          const activeCategories = response.data.data
            .filter((cat: any) => cat.active)
            .map((cat: any) => ({
              id: String(cat.id),
              name: cat.name || "",
              active: !!cat.active,
              departmentId: cat.departmentId || "",
              departmentName: cat.departmentName || "",
              description: cat.description || "",
              image: cat.image || "",
              features: cat.features || [],
            }));
          setCategories(activeCategories);
        }
      } catch (error) {
        // Error silencioso al cargar categorías
      } finally {
        setLoadingCategories(false);
      }
    }
  }, [reset, categories.length, loadingCategories]);

  const openEdit = useCallback(async (n: ImporterNomenclatorDetail) => {
    setSelected(n);
    const ids = (n.categories || []).map((c) => c.id);
    reset({
      name: n.name || "",
      categoryIds: ids,
    });
    setOpened(true);
    
    // Cargar categorías si no están cargadas
    if (categories.length === 0 && !loadingCategories) {
      setLoadingCategories(true);
      try {
        const response = await getAllCategories({ page: 1, pageSize: 1000 });
        if (!response.error && response.data?.data) {
          const activeCategories = response.data.data
            .filter((cat: any) => cat.active)
            .map((cat: any) => ({
              id: String(cat.id),
              name: cat.name || "",
              active: !!cat.active,
              departmentId: cat.departmentId || "",
              departmentName: cat.departmentName || "",
              description: cat.description || "",
              image: cat.image || "",
              features: cat.features || [],
            }));
          setCategories(activeCategories);
        }
      } catch (error) {
        // Error silencioso al cargar categorías
      } finally {
        setLoadingCategories(false);
      }
    }
  }, [reset, categories.length, loadingCategories]);

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
            categoryIds: values.categoryIds,
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
            categoryIds: values.categoryIds,
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
              categories: [],
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

  const handleToggleStatus = useCallback(
    async (nomenclator: ImporterNomenclatorDetail) => {
      try {
        const res = await toggleNomenclatorStatus(nomenclator.id);
        if (res.error) {
          toast.error(res.message || "Error al cambiar el estado del nomenclador");
          return;
        }

        setLocalData((prev) =>
          prev.map((n) =>
            n.id === nomenclator.id ? { ...n, isActive: !n.isActive } : n
          )
        );
        toast.success(
          `Nomenclador ${nomenclator.isActive ? "desactivado" : "activado"} exitosamente`
        );
        router.refresh();
      } catch {
        toast.error("Error al cambiar el estado del nomenclador");
      }
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<ImporterNomenclatorDetail>[]>(
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
          if (!r.categories || r.categories.length === 0) {
            return <span className="text-gray-500 dark:text-gray-400">-</span>;
          }
          
          return (
            <div className="flex flex-wrap gap-1">
              {r.categories.slice(0, 3).map((cat) => (
                <Badge key={cat.id} variant="light" size="sm">
                  {cat.name}
                </Badge>
              ))}
              {r.categories.length > 3 && (
                <Badge variant="outline" size="sm" className="text-gray-500">
                  +{r.categories.length - 3}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessor: "createdAt",
        title: "Fecha de creación",
        render: (r) => {
          return r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-ES") : "-";
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
          Nomencladores - {importerName}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tipos de productos que pueden vender los proveedores de esta importadora
        </p>
      </div>

      <DataGrid<ImporterNomenclatorDetail>
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
              <RHFMultiSelectImporterCategories
                name="categoryIds"
                label="Categorías"
                placeholder="Seleccionar categorías..."
                categories={categories}
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
