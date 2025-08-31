"use client";

import SimpleModal from "@/components/modal/modal";
import { FormProvider } from "@/components/react-hook-form";
import { useWarehouseSelectForm } from "../hooks/use-warehouse-selected-form";
import { Button } from "@/components/button/button";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllWarehouses } from "@/services/warehouses";
import { useCallback } from "react";
import { WarehouseFormData } from "../schemas/warehouse-schema";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WarehouseSelectedModal({ open, onClose }: Props) {
  const { form, onSubmit } = useWarehouseSelectForm();

  const handleOption = useCallback(
    (option: WarehouseFormData) => {
      if (option) {
        form.setValue("type", option?.type?.toLowerCase());
      }
    },
    [form]
  );

  if (!open) return null;

  return (
    <SimpleModal open={open} onClose={onClose} title={"Transferencia"}>
      <div className="p-5 ">
        <FormProvider
          methods={form}
          onSubmit={onSubmit}
          id="warehouse-origin-selected-form"
        >
          <div className="min-h-80 justify-between flex flex-col">
            <div className="grid grid-cols-1 flex-1 gap-4">
              <RHFAutocompleteFetcherInfinity
                name="warehouseOriginId"
                label="Seleccione el almacén de origen "
                placeholder="Seleccione el almacén..."
                objectValueKey="id"
                objectKeyLabel="name"
                queryKey="warehouse"
                onFetch={getAllWarehouses}
                onOptionSelected={handleOption}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 ">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline-secondary"
              >
                Cancelar
              </button>
              <Button type="submit" className="btn btn-primary ">
                Iniciar transferencia
              </Button>
            </div>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
