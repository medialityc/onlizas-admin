"use client";

import SectionForm from "../components/section-form";
import { SectionFormData } from "../schema/section-schema";

type Props = {
  section: SectionFormData;
};
const SectionDetailContainer = ({ section }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Detalles de la Sección
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define la sección y sus características
        </p>
      </div>
      <SectionForm initValue={section} />
    </div>
  );
};

export default SectionDetailContainer;
