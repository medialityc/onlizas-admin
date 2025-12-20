import ImporterDashboardView from "@/sections/importer/dashboard/importer-dashboard-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterDashboardPage({ params }: Props) {
  const { id } = await params;

  return <ImporterDashboardView importerId={id} />;
}
