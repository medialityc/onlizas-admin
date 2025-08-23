import React from "react";
import InventoryProviderForm from "../components/inventory-provider-form/inventory-provider-form";
import { IUserProvider } from "@/types/users";

type Props = {
  userProvider: IUserProvider;
};
const InventoryProviderCreateContainer = ({ userProvider }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Inventario - {userProvider?.id}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el inventario y sus variantes
        </p>
      </div>
      <InventoryProviderForm userProvider={userProvider} />
    </div>
  );
};

export default InventoryProviderCreateContainer;
