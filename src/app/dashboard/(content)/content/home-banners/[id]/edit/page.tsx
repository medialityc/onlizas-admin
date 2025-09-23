import { notFound } from "next/navigation";
import { getBannerById } from "@/services/homebanner";
import BannerEditFormContainer from "@/sections/admin/home-banners/containers/banner-edit-from.container";
import { BannerFormData } from "@/sections/admin/home-banners/schema/banner-schema";

export const metadata = {
  title: "Editar Banner - ZAS Express",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const res = await getBannerById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <BannerEditFormContainer banner={res.data! as unknown as BannerFormData} />
  );
}
