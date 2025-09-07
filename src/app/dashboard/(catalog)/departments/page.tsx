import { buildQueryParams } from "@/lib/request";
import DepartmentsListContainer from "@/sections/departments/list/deparmets-list-container";
import { getAllDepartments } from "@/services/department";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Departamentos - ZAS Express",
  description:
    "Administra los departamentos del sistema y sus reglas específicas",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function DepartmentListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const departmentsPromise = await getAllDepartments(query);

  return (
    <DepartmentsListContainer
      departmentsPromise={departmentsPromise}
      query={params}
    />
  );
}

export default DepartmentListPage;
