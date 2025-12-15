import { redirect } from "next/navigation";
import { checkImporterSession } from "@/services/importer-access";
import ImporterSessionView from "@/sections/importer/dashboard/importer-session-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterDashboardPage({ params }: Props) {
  const { id } = await params;
  const session = await checkImporterSession();

  if (!session.authenticated) {
    redirect(`/importadora/${id}`);
  }

  return (
    <ImporterSessionView
      importerId={id}
      expiresAt={session.expiresAt || 0}
    />
  );
}
