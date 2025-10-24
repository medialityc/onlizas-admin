"use client";

import { useState, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";

import { WarehouseVirtualTypeFormData } from "../schemas/warehouse-virtual-type-schema";
import { useWarehouseVirtualTypeCreateForm } from "../hooks/use-warehouse-virtual-type-create-form";
import { getWarehouseVirtualTypeById } from "@/services/warehouses-virtual-types";
import { WarehouseVirtualTypeDetails } from "../interfaces/warehouse-virtual-type.interface";

interface Props {
  open: boolean;
  onClose: () => void;
  initValue?: WarehouseVirtualTypeFormData;
  isDetailsView?: boolean;
  loading?: boolean;
}

export default function WarehouseVirtualTypeModal({
  open,
  onClose,
  initValue,
  isDetailsView = false,
  loading,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [typeData, setTypeData] = useState<WarehouseVirtualTypeDetails | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const { form, isPending, onSubmit } = useWarehouseVirtualTypeCreateForm(
    initValue,
    onClose
  );

  // Cargar datos completos cuando hay un ID (editar o ver detalles)
  useEffect(() => {
    if (initValue?.id && open) {
      setLoadingData(true);
      setError(null);
      
      getWarehouseVirtualTypeById(initValue.id)
        .then((response) => {
          // Manejar respuesta anidada o directa
          let data = response.data;
          if (response.data && (response.data as any).virtualWarehouseType) {
            data = (response.data as any).virtualWarehouseType;
          }
          
          if (data) {
            setTypeData(data);
            // Actualizar formulario con datos completos
            form.reset({
              name: data.name,
              active: data.active,
              defaultRules: data.defaultRules,
            });
          }
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setError("Error al cargar los datos");
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [initValue?.id, open, form]);

  const handleClose = () => {
    form.reset();
    setError(null);
    setTypeData(null);
    onClose();
  };

  if (!open) return null;

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading || loadingData}
      title={
        isDetailsView
          ? "Detalles del Tipo de almacén virtual"
          : initValue
          ? "Editar Tipo de almacén virtual"
          : "Crear Tipo de almacén virtual"
      }
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Primera fila: Código y Nombre */}
            <div className="grid grid-cols-1  gap-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre del negocio"
                required
                disabled={isDetailsView}
              />
            </div>
            <div className="grid grid-cols-1  gap-4">
              <RHFInputWithLabel
                name="defaultRules"
                label="Regla"
                placeholder="Escribe una regla"
                required
                disabled={isDetailsView}
              />
            </div>

            {/* Campos adicionales solo en modo detalles */}
            {isDetailsView && typeData && (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Almacenes Virtuales Asociados
                    </label>
                    <input
                      type="text"
                      value={typeData.virtualWarehousesCount}
                      disabled
                      readOnly
                      className="form-input bg-gray-50 dark:bg-gray-800"
                      title="Número de almacenes virtuales asociados"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Creación
                    </label>
                    <input
                      type="text"
                      value={new Date(typeData.createdDatetime).toLocaleString('es-ES')}
                      disabled
                      readOnly
                      className="form-input bg-gray-50 dark:bg-gray-800"
                      title="Fecha de creación del tipo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Última Actualización
                    </label>
                    <input
                      type="text"
                      value={new Date(typeData.updatedDatetime).toLocaleString('es-ES')}
                      disabled
                      readOnly
                      className="form-input bg-gray-50 dark:bg-gray-800"
                      title="Fecha de última actualización"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
                disabled={isPending}
              >
                {isDetailsView ? "Cerrar" : "Cancelar"}
              </button>
              {!isDetailsView && (
                <LoaderButton
                  type="submit"
                  loading={isPending}
                  className="btn btn-primary "
                  disabled={isPending}
                >
                  {initValue?.id ? "Guardar Cambios" : "Crear Tipo"}
                </LoaderButton>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
