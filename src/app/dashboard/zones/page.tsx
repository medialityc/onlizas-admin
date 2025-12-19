import { getZones } from "@/services/zones";
import ZonesClient from "@/sections/zones/list/zones.client";

export const metadata = {
  title: "Zonas de Entrega",
};

export default async function ZonesPage() {
  const zonesRes = await getZones();

  return (
    <div className="space-y-6 p-4">
      <ZonesClient initialData={zonesRes.data} />
    </div>
  );
}
