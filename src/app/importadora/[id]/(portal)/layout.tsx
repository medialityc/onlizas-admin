import { redirect } from "next/navigation";
import { checkImporterSession } from "@/services/importer-access";
import { getImporterData } from "@/services/importer-access";
import ImporterLayoutClient from "@/layouts/importer-sidebar/importer-layout-client";
import { ImporterDataProvider } from "@/contexts/importer-data-context";

export const dynamic = "force-dynamic";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ImporterLayout({ children, params }: Props) {
  const { id } = await params;
  const session = await checkImporterSession();

  if (!session.authenticated) {
    redirect(`/importadora/${id}`);
  }

  const importerDataResult = await getImporterData();

  return (
    <ImporterDataProvider importerData={importerDataResult.data || null}>
      <ImporterLayoutClient
        importerId={id}
        importerName={importerDataResult.data?.importerName || "Portal Importadora"}
        expiresAt={session.expiresAt}
      >
        {children}
      </ImporterLayoutClient>
    </ImporterDataProvider>
  );
}
