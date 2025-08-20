import { getCategoryById } from "@/services/categories";
import { notFound } from "next/navigation";
import { CategoryFormData } from "@/sections/categories/schemas/category-schema";
import CategoryDetailsContainer from "@/sections/categories/containers/category-details-from.container";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Detalles Categoría - ZAS Express",
};

export default async function CategoryDetailPage({ params }: Props) {
  const res = await getCategoryById(params.id);
  if (!res || res.error || !res.data) notFound();

  return (
    <CategoryDetailsContainer
      category={res.data! as unknown as CategoryFormData}
    />
  );
}
