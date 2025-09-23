import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function Loading() {
  return (
    <FormSkeleton
      title="Editar Sección"
      description="Define la Sección y sus características"
      sections={8}
    />
  );
}
