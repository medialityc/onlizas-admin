import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <ListSkeleton
      title="Gestión de Monedas"
      description="Administra las monedas del sistema y sus tasas de cambio"
    />
  );
}
