import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Permisos"
      description="Administra los permisos del sistema y sus permisos asociados"
    />
  );
}
