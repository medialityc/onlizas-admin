import { notFound } from "next/navigation";
import BannerEditFormContainer from "@/sections/admin/home-banners/containers/banner-edit-from.container";
import { getHomeBannerById } from "@/services/homebanner";
import { HomeBannerFormData } from "@/sections/admin/home-banners/schema/banner-schema";

export const metadata = {
  title: "Editar Banner - ZAS Express",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const res = await getHomeBannerById((await params).id);
  if (!res || res.error || !res.data) notFound();

  return (
    <BannerEditFormContainer
      banner={res.data! as unknown as HomeBannerFormData}
    />
  );
}
