"use client";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import React from "react";
import { useFormContext } from "react-hook-form";
import { InventoryEasy } from "../../schemas/inventory-easy.schema";
import { getAllProductsBySupplier } from "@/services/products";
import { getAllProviderStores } from "@/services/stores";
import {
  getAllWarehousesBySupplier,
  getAllWarehousesPhysical,
} from "@/services/warehouses";
import { RHFCheckbox } from "@/components/react-hook-form";
import { getAllSupplierUsers } from "@/services/users";
type Props = {
  provider?: number;
};

function InventoryForm({ provider }: Props) {
  const { watch } = useFormContext<InventoryEasy>();
  const supplierId = watch("supplierId") ?? provider;
  const meWarehouse = watch("meWarehouse");
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
          />
          <RHFAutocompleteFetcherInfinity
            name="storeId"
            label="Tienda"
            disabled={!supplierId}
            required
            onFetch={(params) =>
              getAllProviderStores(supplierId.toString(), params)
            }
          />
          <RHFCheckbox
            name="meWarehouse"
            label="¿Guardar en almacén virtual?"
          />
          {!meWarehouse ? (
            <RHFAutocompleteFetcherInfinity
              name={`physicalWarehouseId`}
              label="Almacenes físicos"
              placeholder="Seleccionar almacenes físicos"
              onFetch={getAllWarehousesPhysical}
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="warehouses-physical"
              disabled={!supplierId}
              required
            />
          ) : (
            <RHFAutocompleteFetcherInfinity
              name={`virtualWarehouseId`}
              label="Almacenes del proveedor"
              placeholder="Seleccionar almacenes del proveedor"
              onFetch={(params) =>
                getAllWarehousesBySupplier(supplierId, params)
              }
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="warehouses"
              required
            />
          )}
        </>
      )}
    </div>
  );
}

export default InventoryForm;
