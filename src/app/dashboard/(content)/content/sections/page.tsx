import { buildQueryParams } from "@/lib/request";
import SectionListContainer from "@/sections/admin/sections/containers/section-list-container";
import { getAllSection } from "@/services/section";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de secciones - ZAS Express",
  description: "Administra las secciones de productos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function SectionListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const sectionPromise = await getAllSection(query);

  return (
    <SectionListContainer
      sectionPromise={sectionPromise}
      query={params}
    />
  );
}

export default SectionListPage;
