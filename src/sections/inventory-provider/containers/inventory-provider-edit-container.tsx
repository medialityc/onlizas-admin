import { IUserProvider } from "@/types/users";
import { Button } from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import InventoryEditForm from "../components/inventory-edit-from/inventory-edit-from";
import { InventoryStoreFormData } from "../schemas/inventory-edit.schema";
import { getInventoryEditAdapter } from "../adapters/inventory-edit-adapter";

type Props = {
  userProvider: IUserProvider;
  inventory: InventoryStoreFormData;
};
const InventoryProviderEditContainer = ({ userProvider, inventory }: Props) => {
  const adapted = getInventoryEditAdapter(inventory);
  return (
    <div className="panel">
      <div className="mb-5 flex items-center justify-start gap-2">
        <Link href={`/dashboard/inventory/${userProvider?.id}/list`}>
          <Button className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none text-black dark:text-white border-none">
            <ArrowLeftIcon className="w-5 h-5" /> Volver
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Editar Inventario
            <span className="font-bold"> {userProvider?.name}</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona el inventario del proveedor
            <span className="font-bold"> {userProvider?.name}</span>
          </p>
        </div>
      </div>

      <InventoryEditForm userProvider={userProvider} initValue={adapted} />
    </div>
  );
};

export default InventoryProviderEditContainer;
