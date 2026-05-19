import { buildQueryParams } from "@/lib/request";
import WholesaleBuyersListContainer from "@/sections/wholesale-buyers/list/wholesale-buyers-list-container";
import { getAllWholesaleBuyers } from "@/services/wholesale-buyers";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compradores Mayoristas - Onlizas",
  description: "Gestión de solicitudes de compradores mayoristas",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function WholesaleBuyersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const dataPromise = await getAllWholesaleBuyers(query);

  return (
    <WholesaleBuyersListContainer dataPromise={dataPromise} query={params} />
  );
}

export default WholesaleBuyersPage;
