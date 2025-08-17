import EditWarehouseContent from "@/sections/warehouses/edit/general-data/edit-warehouse-general-content";

export default async function EditWarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditWarehouseContent id={id} />;
}
