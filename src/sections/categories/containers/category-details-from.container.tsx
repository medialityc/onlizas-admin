"use client";

import { CategoryFormData } from "../schemas/category-schema";

type Props = {
  category: CategoryFormData;
};
const CategoryDetailsContainer = ({ category }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Categoría
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define la categoría y sus características
        </p>
      </div>
      <pre> {JSON.stringify(category, null, 2)} </pre>
    </div>
  );
};

export default CategoryDetailsContainer;
