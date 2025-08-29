export default async function EditWarehouseInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <>{id}</>;
}
