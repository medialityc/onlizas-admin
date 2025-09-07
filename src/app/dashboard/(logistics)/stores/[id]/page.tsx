import { notFound } from "next/navigation";
import { getStoreById } from "@/services/stores";
import StoreEditAdminContainer from "@/sections/stores/edit/store-edit-admin-container";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StoreEditPage({ params }: PageProps) {
  const { id } = await params;
  const storeID = Number(id);
  const { data: store } = await getStoreById(storeID);

  if (!store) return notFound();

  return <StoreEditAdminContainer store={store} />;
}
