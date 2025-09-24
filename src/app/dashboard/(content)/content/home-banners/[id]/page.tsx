import { notFound } from "next/navigation";
import { getHomeBannerById } from "@/services/homebanner";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Detalles del Banner - ZAS Express",
};

export default async function CategoryDetailPage({ params }: Props) {
  const res = await getHomeBannerById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return <>EDIT</>;
}
