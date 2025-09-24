import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function Loading() {
  return (
    <FormSkeleton
      title="Editar Banner"
      description="Define la Banner y sus características"
      sections={8}
    />
  );
}
