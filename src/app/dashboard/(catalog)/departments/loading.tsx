import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Departamentos"
      description="Administra los departamentos del sistema y sus datos asociados"
    />
  );
}
