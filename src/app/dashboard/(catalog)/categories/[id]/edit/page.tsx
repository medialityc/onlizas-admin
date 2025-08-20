import { getCategoryById } from "@/services/categories";
import { notFound } from "next/navigation";
import CategoryEditFormContainer from "@/sections/categories/containers/category-edit-from.container";
import { CategoryFormData } from "@/sections/categories/schemas/category-schema";

export const metadata = {
  title: "Editar Categoría - ZAS Express",
};

interface EditPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditPageProps) {
  const res = await getCategoryById(params.id);
  if (!res || res.error || !res.data) notFound();

  return (
    <CategoryEditFormContainer
      category={res.data! as unknown as CategoryFormData}
    />
  );
}
