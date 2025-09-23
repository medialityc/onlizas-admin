"use client";

import SectionForm from "../components/section-form";

const SectionCreateFormContainer = () => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Crear Sección
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define la sección
        </p>
      </div>
      <SectionForm />
    </div>
  );
};

export default SectionCreateFormContainer;
