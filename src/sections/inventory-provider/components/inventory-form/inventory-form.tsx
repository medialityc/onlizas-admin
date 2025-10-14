"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { InventoryEasy } from "../../schemas/inventory-easy.schema";
import { RHFCheckbox } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllProductsBySupplier } from "@/services/products";
import { getAllProviderStores } from "@/services/stores";
import { getAllSupplierUsers } from "@/services/users";
import { RenderWarehouseField } from "./render-warehouse-field";

type Props = {
  provider?: string;
};

function InventoryForm({ provider }: Props) {
  const { watch } = useFormContext<InventoryEasy>();

  const supplierId = watch("supplierId") ?? provider;
  const [meWarehouse, isPaqueteria] = watch(["meWarehouse", "isPaqueteria"]);

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-4">
      {!provider && (
        <RHFAutocompleteFetcherInfinity
          name="supplierId"
          label="Proveedor"
          placeholder="Defina un proveedor"
          required
          onFetch={getAllSupplierUsers}
        />
      )}

      {supplierId && (
        <>
          <RHFAutocompleteFetcherInfinity
            name="productId"
            label="Seleccionar un producto"
            onFetch={(params) => getAllProductsBySupplier(supplierId, params)}
            disabled={!supplierId}
            required
            queryKey={`products-${supplierId}`}
          />

          <RHFCheckbox name="isPaqueteria" label="¿Es paquetería?" />

          <RHFAutocompleteFetcherInfinity
            name="storeId"
            label="Tienda"
            disabled={!supplierId}
            required
            onFetch={(params) => getAllProviderStores(supplierId, params)}
            queryKey={`stores-${supplierId}`}
          />

          {!isPaqueteria && (
            <RHFCheckbox
              name="meWarehouse"
              label="¿Guardar en almacén virtual?"
            />
          )}

          <RenderWarehouseField
            isPaqueteria={isPaqueteria}
            meWarehouse={meWarehouse}
            supplierId={supplierId}
          />
        </>
      )}
    </div>
  );
}

export default InventoryForm;
