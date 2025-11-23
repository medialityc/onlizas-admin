import { buildQueryParams } from "@/lib/request";
import BusinessListContainer from "@/sections/business/list/business-list-container";
import { getAllBusiness } from "@/services/business";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Negocios - Onlizas",
  description: "Administra los negocios del sistema y sus datos asociados",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function BusinessListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const businessPromise = await getAllBusiness(query);

  return (
    <BusinessListContainer businessPromise={businessPromise} query={params} />
  );
}

export default BusinessListPage;
