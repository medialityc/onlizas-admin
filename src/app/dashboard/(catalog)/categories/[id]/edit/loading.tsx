import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function Loading() {
  return (
    <FormSkeleton
      title="Editar Categoría"
      description="Define la categoría y sus características"
      sections={8}
    />
  );
}
