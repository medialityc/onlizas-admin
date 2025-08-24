import EditWarehouseTransfersContent from "@/sections/warehouses/edit/transfer/edit-warehouse-transfer-content";

export default async function EditWarehouseTransfersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditWarehouseTransfersContent id={id} />;
}
