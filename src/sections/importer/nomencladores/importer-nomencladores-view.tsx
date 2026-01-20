"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@mantine/core";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useImporterData } from "@/contexts/importer-data-context";
import {
  ImporterNomenclator,
  ImporterCategory,
} from "@/services/importer-portal";
import ActionsMenu from "@/components/menu/actions-menu";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFMultiSelectImporterCategories from "@/components/react-hook-form/rhf-multi-select-importer-categories";
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
  nomenclators: initialNomenclators,
}: Props) {
  const { importerData } = useImporterData();
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<ImporterNomenclator | null>(null);
  const [localData, setLocalData] = useState<ImporterNomenclator[]>(initialNomenclators);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<ImporterCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const methods = useForm<NomenclatorForm>({
    defaultValues: {
      name: "",
      categoryIds: [],
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (importerData?.nomenclators && importerData.nomenclators !== localData) {
      setLocalData(importerData.nomenclators);
    }
  }, [importerData?.nomenclators]);

  const openCreate = useCallback(async () => {
    setSelected(null);
    reset({ name: "", categoryIds: [] });
    setLoadingCategories(true);
    setOpened(true);
    
    try {
      const response = await fetch("/api/importer-access/categories");
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || "Error al cargar categorías", "error");
        setCategories([]);
      } else {
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      showToast("Error al cargar categorías", "error");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [reset]);

  const openEdit = useCallback(async (n: ImporterNomenclator) => {
    setSelected(n);
    const ids = (n.categories || []).map((c) => c.id);
    reset({
      name: n.name || "",
      categoryIds: ids,
    });
    setLoadingCategories(true);
    setOpened(true);
    
    try {
      const response = await fetch("/api/importer-access/categories");
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.message || "Error al cargar categorías", "error");
        setCategories([]);
      } else {
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      showToast("Error al cargar categorías", "error");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [reset]);

  const close = useCallback(() => {
    setOpened(false);
    setSelected(null);
  }, []);

  const submit = useCallback(
    async (values: NomenclatorForm) => {
      const name = values.name.trim();
      if (!name) {
        showToast("El nombre es requerido", "error");
        return;
      }

      setIsSaving(true);
      try {
        if (!selected) {
          // Crear nuevo nomenclador
          const response = await fetch("/api/importer-access/nomenclators", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              categoryIds: values.categoryIds,
            }),
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            showToast(data.message || "Error al crear nomenclador", "error");
            return;
          }

          // Agregar el nuevo nomenclador a la lista local
          if (data && data.id) {
            setLocalData((prev) => [...prev, data]);
          }
          
          showToast("Nomenclador creado correctamente", "success");
          router.refresh();
          close();
        } else {
          // Editar nomenclador existente
          const response = await fetch(`/api/importer-access/nomenclators/${selected.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              categoryIds: values.categoryIds,
            }),
          });

          const data = await response.json();

          if (!response.ok || data.error) {
            showToast(data.message || "Error al actualizar nomenclador", "error");
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
          showToast("Nomenclador actualizado correctamente", "success");
          router.refresh();
          close();
        }
      } catch (err) {
        console.error("Error en submit nomenclador:", err);
        showToast("Ocurrió un error, intente nuevamente", "error");
      } finally {
        setIsSaving(false);
      }
    },
    [close, router, selected]
  );

  const handleToggleStatus = useCallback(
    async (nomenclator: ImporterNomenclator) => {
      try {
        const response = await fetch(
          `/api/importer-access/nomenclators/${nomenclator.id}/toggle-status`,
          {
            method: "PATCH",
          }
        );

        const data = await response.json();

        if (!response.ok || data.error) {
          const errorMessage = data.message || "Error al cambiar el estado del nomenclador";
          
          // Mostrar mensaje más específico si es un error del servidor
          if (errorMessage.includes("error interno del servidor")) {
            showToast(
              "No se puede cambiar el estado del nomenclador. Puede estar asociado a contratos activos.",
              "error"
            );
          } else {
            showToast(errorMessage, "error");
          }
          return;
        }

        setLocalData((prev) =>
          prev.map((n) =>
            n.id === nomenclator.id ? { ...n, isActive: !n.isActive } : n
          )
        );
        showToast(
          `Nomenclador ${nomenclator.isActive ? "desactivado" : "activado"} exitosamente`,
          "success"
        );
        router.refresh();
      } catch (error) {
        console.error("Error en handleToggleStatus:", error);
        showToast("Error al cambiar el estado del nomenclador", "error");
      }
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<ImporterNomenclator>[]>(
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
                categories.map((cat: { id: string; name: string }) => (
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
              <RHFMultiSelectImporterCategories
                name="categoryIds"
                label="Categorías"
                placeholder={loadingCategories ? "Cargando categorías..." : "Seleccione las categorías"}
                categories={categories}
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
              <LoaderButton
                type="submit"
                loading={isSaving}
                disabled={isSaving || loadingCategories}
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
