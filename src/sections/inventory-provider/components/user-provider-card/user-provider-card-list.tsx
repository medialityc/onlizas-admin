import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import UserProviderCard from "./user-provider-card";
import { IUserProvider } from "@/types/users";

type Props = {
  data?: IUserProvider[];
  searchParams: SearchParams;
};
const UserProviderCardList = ({ data, searchParams }: Props) => {
  const id = useId();
  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          {searchParams
            ? "No se encontraron usuarios proveedores que coincidan con tu búsqueda"
            : "No se encontraron usuarios proveedores"}
        </div>
        {/* {!searchQuery && (
          <Button variant="primary" onClick={handleCreate}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear primer almacén
          </Button>
        )} */}
      </div>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((provider: IUserProvider) => (
        <div className="col-span-1" key={`${id}-${provider?.id}`}>
          <UserProviderCard item={provider} />
        </div>
      ))}
    </section>
  );
};

export default UserProviderCardList;
