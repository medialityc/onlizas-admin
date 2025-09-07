import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Usuarios"
      description="Administra los usuarios del sistema y sus permisos"
    />
  );
}
