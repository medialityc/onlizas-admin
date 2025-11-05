import { buildQueryParams } from "@/lib/request";
import BrandListContainer from "@/sections/brands/list/brand-list-container";
import { getAllBrands } from "@/services/brands";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Marcas - ZAS Admin",
  description: "Administra las marcas del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function BrandListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const res = await getAllBrands(query);
  if (res.error || !res.data) {
    throw new Error(res.message);
  }

  return <BrandListContainer brandsPromise={res} query={params} />;
}

export default BrandListPage;
