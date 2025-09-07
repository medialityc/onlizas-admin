import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export default function Loading() {
  return (
    <FormSkeleton
      title="Editar Product"
      description="Define el producto y sus características"
    />
  );
}
