import { Suspense } from "react";
import { getProductById } from "@/services/products";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { paths } from "@/config/paths";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

// Esqueleto de carga
function ProductViewFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-full sm:w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-4 w-full mt-4 sm:mt-0">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

async function ProductDetails({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();

  const product = response.data;
  const productImage =
    product.images?.find((img) => img.order === 1)?.image ||
    "/placeholder-product.jpg";

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 py-4">
      {/* Encabezado con botones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Detalles del Producto</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href={paths.provider.products.edit(product.id)} className="flex-1 sm:flex-auto">
            <Button className="w-full sm:w-auto">Editar</Button>
          </Link>
          <Link href={paths.provider.products.list} className="flex-1 sm:flex-auto">
            <Button variant="secondary" outline className="w-full sm:w-auto">
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Información principal del producto */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Imagen del producto */}
          <div className="w-full sm:w-48 h-48 flex-shrink-0">
            <div className="relative w-full h-full">
              <Image
                src={productImage}
                alt={product.name}
                className="w-full h-full object-contain sm:object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                width={192}
                height={192}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description || "Sin descripción disponible"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Categoría:
                  </span>
                  <div className="mt-1">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((category) => (
                        <span
                          key={category.id}
                          className="text-blue-600 dark:text-blue-400 font-medium"
                        >
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">Sin categoría</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Creado:
                  </span>
                  <div className="mt-1 text-gray-900 dark:text-gray-200">2024-01-15</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Estado:
                  </span>
                  <div className="mt-1">
                    <Badge variant="success">
                      Activo
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actualizado:
                  </span>
                  <div className="mt-1 text-gray-900 dark:text-gray-200">2024-01-20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proveedores que usan este producto */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Proveedores que usan este producto
        </h3>

        {product.suppliers && product.suppliers.length > 0 ? (
          <div className="space-y-3">
            {product.suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {supplier.name}
                </span>
                <Badge variant="success">Activo</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            No hay proveedores asociados a este producto
          </div>
        )}
      </div>

      {/* Información adicional */}
      {(product.about && product.about.length > 0) ||
      (product.details && product.details.length > 0) ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información adicional
          </h3>

          {product.about && product.about.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Acerca del producto:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 pl-1">
                {product.about.map((item, i) => (
                  <li key={i} className="break-words">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.details && product.details.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detalles técnicos:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                {product.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700"
                  >
                    <span className="font-medium text-gray-600 dark:text-gray-400 mr-2">
                      {detail.name}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-200 text-right break-words">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default async function ViewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15 params es una Promesa
  return (
    <Suspense fallback={<ProductViewFallback />}>
      <ProductDetails id={id} />
    </Suspense>
  );
}
