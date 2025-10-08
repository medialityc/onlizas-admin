import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import InventoryProviderCard from "./inventory-provider-card";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { InventoryProvider } from "@/types/inventory";
import { useModalState } from "@/hooks/use-modal-state";
import { usePermissions } from "zas-sso-client";

type Props = {
  data?: InventoryProvider[];
  searchParams: SearchParams;
};
const InventoryProviderList = ({ data, searchParams }: Props) => {
  const id = useId();
  const { openModal } = useModalState();

  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canCreate = hasPermission(["Create"]);

  // Modal states controlled by URL
  const handleOpen = () => {
    openModal("create");
  };
  if (data?.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col justify-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams?.search
            ? "No se encontraron inventarios que coincidan con tu búsqueda"
            : "No se encontraron inventarios"}
        </div>
        {!searchParams?.search && canCreate && (
          <Button variant="primary" className="mx-auto" onClick={handleOpen}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear un inventario
          </Button>
        )}
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((provider: InventoryProvider, idx) => (
        <div className="col-span-1" key={`${id}-${provider?.id}${idx}`}>
          <InventoryProviderCard item={provider} />
        </div>
      ))}
    </section>
  );
};

export default InventoryProviderList;
