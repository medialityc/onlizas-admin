import { getPlatformAccountById } from "@/services/finance/platform-accounts";
import PlatformAccountDetails from "@/sections/finance/details/platform-account-details";
import showToast from "@/config/toast/toastConfig";

interface PageProps {
  params: { id: string };
}

export default async function PlatformAccountDetailPage({ params }: PageProps) {
  const { id } = params;
  const res = await getPlatformAccountById(id);

  if (res.error || !res.data) {
    // Server component; cannot call toast directly. Render fallback.
    return (
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-2">Cuenta de Plataforma</h1>
        <p className="text-sm text-red-600">No se pudo cargar la cuenta.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PlatformAccountDetails account={res.data} />
    </div>
  );
}
