import { buildQueryParams } from "@/lib/request";
import DepartmentsListContainer from "@/sections/departments/list/deparmets-list-container";
import { getAllDepartments } from "@/services/department";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

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

function ListSkeleton() {
  return (
    <div className="panel">
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

async function DepartmentListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const departmentsPromise = await getAllDepartments(query);

  return (
    <Suspense fallback={<ListSkeleton />}>
      <DepartmentsListContainer
        departmentsPromise={departmentsPromise}
        query={params}
      />
    </Suspense>
  );
}

export default DepartmentListPage;
