import { notFound } from "next/navigation";
import SectionDetailContainer from "@/sections/admin/sections/containers/section-detail-from.container";
import { SectionFormData } from "@/sections/admin/sections/schema/section-schema";
import { getSectionById } from "@/services/section";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Detalles Sección - Onlizas",
};

export default async function SectionDetailPage({ params }: Props) {
  const res = await getSectionById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <SectionDetailContainer section={res.data! as unknown as SectionFormData} />
  );
}
