import EditWarehouseInventoryContent from "@/sections/warehouses/edit/inventory/edit-warehouse-content";

export default async function EditWarehouseInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditWarehouseInventoryContent id={id} />;
}
