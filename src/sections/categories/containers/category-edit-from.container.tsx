"use client";

import CategoryForm from "../components/category-form";
// import { setCategoryAdapter } from "../constants/category-adapter";
import { CategoryFormData } from "../schemas/category-schema";

type Props = {
  category: CategoryFormData;
};
const CategoryEditFormContainer = ({ category }: Props) => {
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
      <CategoryForm initValue={category} />
    </div>
  );
};

export default CategoryEditFormContainer;
