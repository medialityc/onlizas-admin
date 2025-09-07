import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Productos"
      description="Administra los productos del sistema y sus datos asociados"
    />
  );
}
