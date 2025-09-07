import { buildQueryParams } from "@/lib/request";
import StoresListContainer from "@/sections/stores/list/stores-list-container";
import { getAllStores } from "@/services/stores";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Tiendas - ZAS Express",
  description: "Administra las tiendas del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function StoresListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const storesPromise = await getAllStores(query);

  return <StoresListContainer storesPromise={storesPromise} query={params} />;
}

export default StoresListPage;
