import { Suspense } from 'react';
import { getWarehouseById } from '@/services/warehouses-mock';
import Badge from '@/components/badge/badge';
import { Button } from '@/components/button/button';
import { paths } from '@/config/paths';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function WarehouseViewFallback () {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

async function WarehouseDetails ({ id }: { id: string }) {
  const response = await getWarehouseById(Number(id));
  if (!response?.data) notFound();
  const w = response.data;
  const occupancy = w.maxCapacity ? Math.round(((w.currentCapacity || 0) / w.maxCapacity) * 100) : undefined;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{w.name}</h1>
        <div className="flex gap-2">
          <Link href={paths.dashboard.warehouses.edit(w.id)}><Button>Editar</Button></Link>
          <Link href={paths.dashboard.warehouses.list}><Button variant="secondary" outline>Volver</Button></Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Estado:</label>
            <Badge variant={w.status === 'active' ? 'success' : w.status === 'maintenance' ? 'warning' : 'secondary'}>
              {w.status === 'active' ? 'Activo' : w.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
            </Badge>
          </div>
          {w.description && (
            <div>
              <label className="font-semibold">Descripción:</label>
              <p className="text-gray-600">{w.description}</p>
            </div>
          )}
          <div>
            <label className="font-semibold">Tipo:</label>
            <p>{w.type === 'physical' ? 'Físico' : 'Virtual'}</p>
          </div>
          {w.type === 'physical' && (
            <div>
              <label className="font-semibold">Capacidad:</label>
              <p>{w.currentCapacity || 0} / {w.maxCapacity || 0} ({occupancy !== undefined ? `${occupancy}%` : '—'})</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Creado:</label>
            <p>{new Date(w.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="font-semibold">Actualizado:</label>
            <p>{new Date(w.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ViewWarehousePage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<WarehouseViewFallback />}>
      <WarehouseDetails id={id} />
    </Suspense>
  );
}
