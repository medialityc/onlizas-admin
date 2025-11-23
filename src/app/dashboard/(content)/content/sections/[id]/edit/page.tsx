import { notFound } from "next/navigation";
import { getSectionById } from "@/services/section";
import SectionEditFormContainer from "@/sections/admin/sections/containers/section-edit-from.container";
import { SectionFormData } from "@/sections/admin/sections/schema/section-schema";

export const metadata = {
  title: "Editar Sección - Onlizas",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditPageProps) {
  const res = await getSectionById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <SectionEditFormContainer
      section={res.data! as unknown as SectionFormData}
    />
  );
}
