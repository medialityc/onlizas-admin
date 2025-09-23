import { getCategoryById } from "@/services/categories";
import { notFound } from "next/navigation";
import SectionDetailContainer from "@/sections/admin/sections/containers/section-detail-from.container";
import { SectionFormData } from "@/sections/admin/sections/schema/section-schema";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Detalles Sección - ZAS Express",
};

export default async function SectionDetailPage({ params }: Props) {
  const res = await getCategoryById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <SectionDetailContainer
      section={res.data! as unknown as SectionFormData}
    />
  );
}
