"use client";

import { GetZones } from "@/types/zones";
import ZonesList from "./zones-list";

interface Props {
  initialData?: GetZones;
}

export default function ZonesClient({ initialData }: Props) {
  return (
    <div className="panel">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Zonas de Entrega</h2>
          <p className="text-sm text-gray-500">
            Administra las zonas de entrega y sus costos
          </p>
        </div>
      </div>
      <ZonesList data={initialData} />
    </div>
  );
}
