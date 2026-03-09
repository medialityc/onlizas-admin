import { getInventoryById } from "@/services/inventory-providers";
import { getReviewsByInventoryId } from "@/services/reviews";
import { notFound, redirect } from "next/navigation";
import InventoryDetailView from "@/sections/inventory/inventory-detail-view";
import { InventoryProvider } from "@/types/inventory";

interface Props {
  params: Promise<{ id: string; provider: string }>;
}

export const metadata = {
  title: "Detalles de inventario - Onlizas",
};

export default async function InventoryDetailPage({ params }: Props) {
  const { id } = await params;
  const [res, reviewsResponse] = await Promise.all([
    getInventoryById(id),
    getReviewsByInventoryId(id, { page: 1, pageSize: 10 }),
  ]);

  if (res.status === 401) {
    // auth expired, send to home/login
    redirect("/");
  }

  if (res.error || !res.data) {
    // not found or error
    console.error(res.message || "Ocurrió un error al obtener el inventario");
    notFound();
  }

  const inventory: InventoryProvider = res.data;

  return (
    <InventoryDetailView
      inventory={inventory}
      reviews={reviewsResponse.data}
      reviewsError={reviewsResponse.error ? reviewsResponse.message : undefined}
    />
  );
}
