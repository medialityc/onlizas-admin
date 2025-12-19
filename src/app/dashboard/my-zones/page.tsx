import { getServerSession } from "zas-sso-client";
import { getMyZones } from "@/services/zones";
import ZonesClient from "@/sections/zones/list/zones.client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mis Zonas de Entrega",
};

export default async function MyZonesPage() {
  const session = await getServerSession();
  const userId = session?.user?.id?.toString();

  if (!userId) {
    redirect("/dashboard");
  }

  const zonesRes = await getMyZones();

  return (
    <div className="space-y-6 p-4">
      <ZonesClient initialData={zonesRes.data} />
    </div>
  );
}
