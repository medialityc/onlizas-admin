"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { InventoryEasy } from "../../schemas/inventory-easy.schema";
import { RHFCheckbox } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllProductsBySupplier } from "@/services/products";
import { getAllProviderStores } from "@/services/stores";
import { getAllSupplierUsers } from "@/services/users";
import { RenderWarehouseField } from "./render-warehouse-field";
import { getSupplierApprovalProcessById } from "@/services/supplier";
import { SUPPLIER_TYPE_SELLER } from "@/sections/suppliers/constants/supplier.options";

type Props = {
  provider?: string;
};

function InventoryForm({ provider }: Props) {
  const { watch } = useFormContext<InventoryEasy>();

  const supplierId = watch("supplierId") ?? provider;
  const [meWarehouse, isPaqueteria] = watch(["meWarehouse", "isPaqueteria"]);
  const { setValue } = useFormContext<InventoryEasy>();
  const [canMarkMayorista, setCanMarkMayorista] = useState(false);
  const [sellerTypeLoading, setSellerTypeLoading] = useState(false);
  const [sellerTypeError, setSellerTypeError] = useState<string | null>(null);

  // Fetch supplier approval process (con sellerType) when supplierId changes
  useEffect(() => {
    if (!supplierId) {
      setCanMarkMayorista(false);
      setValue("isMayorista", false); // ensure false if no supplier
      return;
    }
    let mounted = true;
    setSellerTypeLoading(true);
    setSellerTypeError(null);
    getSupplierApprovalProcessById(String(supplierId))
      .then((res) => {
        if (!mounted) return;
        if (res.error) {
          setCanMarkMayorista(false);
          setValue("isMayorista", false);
          setSellerTypeError(res.message || "Error obteniendo supplier");
          return;
        }
        const sellerTypeStr = res.data?.sellerType?.toString() || "";
        console.log("[InventoryForm] sellerType fetched", sellerTypeStr);
        const allow = ["Mayorista", "Ambos"].includes(sellerTypeStr);
        setCanMarkMayorista(allow);
        if (!allow) {
          setValue("isMayorista", false);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("[InventoryForm] approval-process fetch error", err);
        setSellerTypeError("No se pudo cargar sellerType");
        setCanMarkMayorista(false);
        setValue("isMayorista", false);
      })
      .finally(() => mounted && setSellerTypeLoading(false));
    return () => {
      mounted = false;
    };
  }, [supplierId, setValue]);

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
            extraFilters={{ supplierId }}
            required
            queryKey={"products"}
          />

          <RHFCheckbox name="isPaqueteria" label="¿Es paquetería?" />

          {sellerTypeLoading && (
            <div className="text-xs text-muted-foreground">
              Cargando tipo de vendedor...
            </div>
          )}
          {!sellerTypeLoading && canMarkMayorista && (
            <RHFCheckbox name="isMayorista" label="¿Inventario mayorista?" />
          )}
          {!sellerTypeLoading && !canMarkMayorista && sellerTypeError && (
            <div className="text-xs text-red-600">{sellerTypeError}</div>
          )}

          <RHFAutocompleteFetcherInfinity
            name="storeId"
            label="Tienda"
            disabled={!supplierId}
            required
            onFetch={(params) => getAllProviderStores(supplierId, params)}
            extraFilters={{ supplierId }}
            queryKey={"stores"}
          />

          {!isPaqueteria && (
            <RHFCheckbox
              name="meWarehouse"
              label="¿Guardar en almacén del proveedor?"
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
