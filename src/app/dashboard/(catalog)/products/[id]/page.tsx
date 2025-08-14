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
            <Badge variant={product.isActive ? 'success' : 'secondary'}>
              {product.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          {product.description && (
            <div>
              <label className="font-semibold">Descripción:</label>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}
          {product.categories && product.categories.length > 0 && (
            <div>
              <label className="font-semibold">Categorías:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.categories.map(category => (
                  <Badge key={category.id} variant="outline-primary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {product.suppliers && product.suppliers.length > 0 && (
            <div>
              <label className="font-semibold">Proveedores:</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.suppliers.map(supplier => (
                  <Badge key={supplier.id} variant="outline-secondary">
                    {supplier.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {product.dimensions && (
            <div>
              <label className="font-semibold">Dimensiones:</label>
              <p>
                {product.dimensions.height && `Alto: ${product.dimensions.height}cm`}
                {product.dimensions.width && ` | Ancho: ${product.dimensions.width}cm`}
                {product.dimensions.lenght && ` | Largo: ${product.dimensions.lenght}cm`}
              </p>
            </div>
          )}
          {product.images && product.images.length > 0 && (
            <div>
              <label className="font-semibold">Imágenes:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {product.images
                  .sort((a, b) => a.order - b.order)
                  .map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image}
                        alt={`Imagen ${image.order}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      {image.order === 1 && (
                        <Badge className="absolute top-2 left-2" variant="primary">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {product.about && product.about.length > 0 && (
        <div>
          <label className="font-semibold">Acerca del producto:</label>
          <ul className="list-disc list-inside mt-2">
            {product.about.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {product.details && product.details.length > 0 && (
        <div>
          <label className="font-semibold">Detalles del producto:</label>
          <div className="mt-2 space-y-2">
            {product.details.map((detail, i) => (
              <div key={i} className="flex justify-between border-b pb-1">
                <span className="font-medium">{detail.name}:</span>
                <span>{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {product.features && product.features.length > 0 && (
        <div>
          <label className="font-semibold">Características:</label>
          <div className="mt-2 space-y-2">
            {product.features.map((feature, i) => (
              <div key={i} className="flex justify-between border-b pb-1">
                <span className="font-medium">{feature.name}:</span>
                <span>{feature.values.join(', ')}</span>
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