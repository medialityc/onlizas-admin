import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";
import { getInventoryEditAdapter } from "../adapters/inventory-edit-adapter";
import InventoryHeader from "../components/inventory-edit-from/inventory-info";
import EditContainer from "./edit-container";
import { CategoryFeature } from "@/types/products";
import { InventoryProvider } from "@/types/inventory";
import { ShadCnButton } from "@/components/button/shadcn-button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  inventory: InventoryProvider;
  features: CategoryFeature[];
};
const InventoryProviderEditContainer = ({ inventory, features }: Props) => {
  const adapted: InventoryStoreFormData = getInventoryEditAdapter(inventory);

  console.log("Adapted inventory:", inventory);

  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-start gap-2">
        <ShadCnButton
          variant={"ghost"}
          className="hover:bg-slate-700/30"
          asChild
        >
          <Link href={`/dashboard/inventory`}>
            <ArrowLeft /> Volver
          </Link>
        </ShadCnButton>
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Editar Inventario
            <span className="font-bold"> {inventory?.supplierName}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona el inventario del proveedor
            <span className="font-bold"> {inventory?.supplierName}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <InventoryHeader inventory={adapted as InventoryStoreFormData} />
        <EditContainer inventory={adapted} features={features} />
      </div>
    </div>
  );
};

export default InventoryProviderEditContainer;
