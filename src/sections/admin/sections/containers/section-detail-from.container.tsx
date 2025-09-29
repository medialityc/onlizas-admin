"use client";

import SectionDetail from "../components/section-detail";
import { SectionFormData } from "../schema/section-schema";

type Props = {
  section: SectionFormData;
};
const SectionDetailContainer = ({ section }: Props) => {
  return (
    <div>
      <SectionDetail section={section} />
    </div>
  );
};

export default SectionDetailContainer;
