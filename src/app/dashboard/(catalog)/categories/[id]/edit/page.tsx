import { getCategoryById } from "@/services/categories";
import CategoryForm from "@/sections/categories/form/category-form";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditPageProps) {
  const res = await getCategoryById(params.id);
  if (!res || res.error || !res.data) notFound();

  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Categoría
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Actualiza la categoría y sus características
        </p>
      </div>
      <CategoryForm category={res.data!} />
    </div>
  );
}
