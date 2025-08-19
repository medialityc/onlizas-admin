import CategoryForm from "@/sections/categories/form/category-form";

export const metadata = {
  title: "Crear Categoría - ZAS Express",
};

export default function NewCategoryPage() {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Categoría
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define la categoría y sus características
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
