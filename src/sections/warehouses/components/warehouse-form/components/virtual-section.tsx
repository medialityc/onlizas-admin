import { RHFInputWithLabel } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllSupplierUsers } from "@/services/users";
import { WarehouseIcon } from "lucide-react";
import React from "react";

const VirtualSection = () => {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <WarehouseIcon className="w-5 h-5 text-gray-500 dark:text-gray-100" />
          <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-100 leading-none">
            Datos de almacén virtual
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <RHFAutocompleteFetcherInfinity
            name="supplierId"
            label="Proveedor asociado"
            placeholder="Seleccionar proveedor asociado"
            onFetch={getAllSupplierUsers}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="suppliers"
          />
        </div>
      </div>
    </section>
  );
};

export default VirtualSection;
