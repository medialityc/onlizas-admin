"use client";

import { ChartBarIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";

type Props = {
  occupancy: number;
  max: number;
  current: number;
  capacityError: boolean;
  capacityWarnZeroMax: boolean;
};

export default function CapacitySection({
  occupancy,
  max,
  current,
  capacityError,
  capacityWarnZeroMax,
}: Props) {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Capacidad
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Define la capacidad máxima y la ocupación actual.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RHFInput
          name="maxCapacity"
          label="Capacidad Máxima"
          type="number"
          placeholder="Ej: 10000"
          underLabel="Unidades totales que puede almacenar"
        />
        <RHFInput
          name="currentCapacity"
          label="Capacidad Actual"
          type="number"
          placeholder="Ej: 2500"
        />
        <RHFInput
          name="description"
          type="textarea"
          rows={3}
          label="Descripción"
          placeholder="Notas o detalles sobre el almacén"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Ocupación</span>
          <span>
            {isFinite(occupancy) ? `${occupancy}%` : "0%"}
            {max > 0 && ` • ${current}/${max}`}
          </span>
        </div>
        <div
          className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
          title={
            max > 0
              ? `${current} de ${max} (${occupancy}%)`
              : current > 0
                ? `${current} sin capacidad máxima definida`
                : "Sin datos de capacidad"
          }
        >
          <div
            className={
              "h-full rounded-full transition-all duration-300 " +
              (capacityError
                ? "bg-rose-600"
                : occupancy < 70
                  ? "bg-emerald-500"
                  : occupancy < 90
                    ? "bg-amber-500"
                    : "bg-rose-500")
            }
            style={{ width: `${isFinite(occupancy) ? occupancy : 0}%` }}
          />
        </div>
        {capacityError && (
          <p className="text-xs mt-1 text-red-600 dark:text-red-400">
            La capacidad actual excede la máxima.
          </p>
        )}
        {!capacityError && capacityWarnZeroMax && (
          <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
            Hay unidades registradas pero la capacidad máxima es 0.
          </p>
        )}
      </div>
    </section>
  );
}
