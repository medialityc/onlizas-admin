import { buildQueryParams } from "@/lib/request";
import ClaimsServerWrapper from "@/sections/claims/containers/claims-server-wrapper";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reclamaciones - Onlizas",
  description: "Gestiona las reclamaciones",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function ClaimsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);

  return <ClaimsServerWrapper query={params} />;
}

export default ClaimsPage;
