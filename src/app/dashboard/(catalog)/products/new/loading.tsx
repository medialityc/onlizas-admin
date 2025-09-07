import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Crear Product"
      description="Define el producto y sus características"
    />
  );
}
