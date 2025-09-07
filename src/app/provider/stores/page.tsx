import { getSession } from "@/auth-sso/services/server-actions";
import { buildQueryParams } from "@/lib/request";
import StoresListContainer from "@/sections/provider-management/stores/list/stores-list-container";
import { getAllProviderStores } from "@/services/stores";
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
  const { user } = await getSession();
  const query: IQueryable = buildQueryParams(params);
  const storesPromise = getAllProviderStores(user?.id ?? 0, query);

  return <StoresListContainer storesPromise={storesPromise} query={params} />;
}

export default StoresListPage;
