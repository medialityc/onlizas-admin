import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Roles"
      description="Administra los roles del sistema y sus permisos asociados"
    />
  );
}
