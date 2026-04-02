import { getOnlizasZones, getZones } from "@/services/zones";
import ZonesClient from "@/sections/zones/list/zones.client";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";

export const metadata = {
  title: "Zonas de Entrega",
};

export default async function ZonesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const zonesRes = await getOnlizasZones(query);

  return (
    <div className="space-y-6 p-4">
      <ZonesClient initialData={zonesRes.data} type="onlizas" />
    </div>
  );
}
