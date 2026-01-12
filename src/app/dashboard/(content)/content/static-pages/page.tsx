import { buildQueryParams } from "@/lib/request";
import StaticPageListContainer from "@/sections/static-pages/list/static-page-list-container";
import { getAllStaticPages } from "@/services/static-pages";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Páginas Estáticas - ZAS Admin",
  description: "Administra las páginas estáticas del sistema",
  icons: { icon: "/assets/images/NEWZAS.svg" },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function StaticPagesListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const res = await getAllStaticPages(query, true);
  if (res.error || !res.data) {
    throw new Error(res.message);
  }

  return <StaticPageListContainer pagesPromise={res} query={params} />;
}

export default StaticPagesListPage;
