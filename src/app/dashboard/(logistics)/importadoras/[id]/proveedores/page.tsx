import { getImporterById, getPendingContractRequests, getSupplierContracts } from "@/services/importers";
import ProvidersListClient from "@/sections/importers/providers/providers-list.client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ImporterProvidersPage({ params }: Props) {
  const { id } = await params;
  
  const [importerRes, pendingRes, approvedRes] = await Promise.all([
    getImporterById(id),
    getPendingContractRequests(id),
    getSupplierContracts(id),
  ]);

  if (importerRes.error || !importerRes.data) {
    notFound();
  }

  const pendingRequests = pendingRes.error ? [] : (pendingRes.data?.data || []);
  const approvedContracts = approvedRes.error ? [] : (approvedRes.data?.data || []);

  return (
    <ProvidersListClient
      pendingRequests={pendingRequests}
      approvedContracts={approvedContracts}
      importerName={importerRes.data.name}
    />
  );
}
