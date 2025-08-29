export default async function EditWarehouseTransfersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <>{id}</>;
}
