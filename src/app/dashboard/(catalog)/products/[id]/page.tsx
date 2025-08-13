import { Suspense } from 'react';
import { getProductById } from '@/services/products-mock';
import Badge from '@/components/badge/badge';
import { Button } from '@/components/button/button';
import { paths } from '@/config/paths';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Esqueleto de carga
function ProductViewFallback () {
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

async function ProductDetails ({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();
  const product = response.data;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex gap-2">
          <Link href={paths.dashboard.products.edit(product.id)}>
            <Button>Editar</Button>
          </Link>
          <Link href={paths.dashboard.products.list}>
            <Button variant="secondary" outline>Volver</Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Estado:</label>
            <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
              {product.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          {product.description && (
            <div>
              <label className="font-semibold">Descripción:</label>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
          {product.upcCode && (
            <div>
              <label className="font-semibold">Código UPC:</label>
              <p>{product.upcCode}</p>
            </div>
          )}
          {product.npnCode && (
            <div>
              <label className="font-semibold">Código NPN:</label>
              <p>{product.npnCode}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {product.dimensions && (
            <div>
              <label className="font-semibold">Dimensiones:</label>
              <p>
                {product.dimensions.height}x{product.dimensions.width}x{product.dimensions.depth} {product.dimensions.unit}
              </p>
            </div>
          )}
          {product.warranty && (
            <div>
              <label className="font-semibold">Garantía:</label>
              <p>{product.warranty}</p>
            </div>
          )}
          <div>
            <label className="font-semibold">Creado:</label>
            <p>{new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="font-semibold">Actualizado:</label>
            <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      {(product.featuredCharacteristics ?? []).length > 0 && (
        <div>
          <label className="font-semibold">Características destacadas:</label>
          <ul className="list-disc list-inside mt-2">
            {(product.featuredCharacteristics ?? []).map((char, i) => (
              <li key={i}>{char}</li>
            ))}
          </ul>
        </div>
      )}
      {(product.specifications ?? []).length > 0 && (
        <div>
          <label className="font-semibold">Especificaciones técnicas:</label>
          <div className="mt-2 space-y-2">
            {(product.specifications ?? []).map((spec, i) => (
              <div key={i} className="flex justify-between border-b pb-1">
                <span className="font-medium">{spec.key}:</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function ViewProductPage ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Next 15 params es una Promesa
  return (
    <Suspense fallback={<ProductViewFallback />}>
      <ProductDetails id={id} />
    </Suspense>
  );
}