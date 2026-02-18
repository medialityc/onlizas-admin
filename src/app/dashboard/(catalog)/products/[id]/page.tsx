import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { paths } from "@/config/paths";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/services/products";
import ProductTutorialsDisplay from "@/sections/products/components/product-tutorials-display";

async function ProductDetails({ id }: { id: string }) {
  const response = await getProductById(id);
  if (!response?.data) notFound();

  const { image: productImage, ...rawProduct } = response.data as any;
  const product = {
    ...rawProduct,
    tutorials: (rawProduct as any).tutorials || [],
  } as any;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado con botones */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles del Producto</h1>
        <div className="flex gap-2">
          <Link href={paths.dashboard.products.edit(product.id)}>
            <Button>Editar</Button>
          </Link>
          <Link href={paths.dashboard.products.list}>
            <Button variant="outline">Volver</Button>
          </Link>
        </div>
      </div>

      {/* Información principal del producto */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-6">
          {/* Imagen del producto */}
          <div className="w-48 h-48 flex-shrink-0">
            <Image
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg border bg-gray-50"
              width={192}
              height={192}
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600">
                {product.description || "Sin descripción disponible"}
              </p>
            </div>

            {/* Bloques de propiedades nuevas y técnicas */}
            <div className="space-y-6">
              {/* Meta & Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Marca:
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      {product.brand?.name ? (
                        <Badge variant="primary">{product.brand.name}</Badge>
                      ) : (
                        <span className="text-gray-400">Sin marca</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Categorías:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((category: any) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">Sin categoría</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Estado:
                    </span>
                    <div className="mt-1">
                      <Badge
                        variant={
                          product.state
                            ? "outline-success"
                            : "outline-secondary"
                        }
                      >
                        {product.state ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {/* Dimensiones y Logística */}
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Dimensiones (L x W x H):
                    </span>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.length || product.width || product.height ? (
                        <>
                          {product.length ?? 0} x {product.width ?? 0} x{" "}
                          {product.height ?? 0} cm
                        </>
                      ) : (
                        <span className="text-gray-400">No definidas</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Peso:
                    </span>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.weight ? (
                        `${product.weight} kg`
                      ) : (
                        <span className="text-gray-400">No definido</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Código GTIN / NISO:
                    </span>
                    <div className="mt-1 text-xs font-mono text-gray-700 flex flex-col">
                      <span>GTIN: {product.gtin || "-"}</span>
                      <span>NISO: {product.niso || "-"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Fuente:
                    </span>
                    <div className="mt-1 text-sm text-gray-900">
                      {product.source || (
                        <span className="text-gray-400">No definida</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Aduana Category */}
              {product.aduanaCategory && (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <p className="text-sm font-semibold mb-2">
                    Clasificación Aduanera
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Capítulo</span>
                      <span className="font-medium">
                        {product.aduanaCategory.chapter} -{" "}
                        {product.aduanaCategory.chapterName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Regla Específica
                      </span>
                      <span className="font-medium">
                        {product.aduanaCategory.specificRule || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Fuente</span>
                      <span className="font-medium">
                        {product.aduanaCategory.source || "-"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">GUID</span>
                      <span className="font-mono text-xs">
                        {product.aduanaCategory.guid}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Proveedores que usan este producto */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Proveedores que usan este producto
        </h3>

        {product.suppliers && product.suppliers.length > 0 ? (
          <div className="space-y-3">
            {product.suppliers.map((supplier: any) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-medium text-gray-900">
                  {supplier.name}
                </span>
                <Badge variant="success">Activo</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay proveedores asociados a este producto
          </div>
        )}
      </div>

      {/* Información adicional */}
      {(product.aboutThis && product.aboutThis.length > 0) ||
      (product.details && Object.keys(product.details).length > 0) ? (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información adicional
          </h3>

          {product.aboutThis && product.aboutThis.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Acerca del producto:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.aboutThis.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.details && Object.keys(product.details).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Detalles técnicos:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(product.details).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-1 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span
                      className="text-gray-900 truncate max-w-[60%]"
                      title={String(value)}
                    >
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Tutoriales */}
      <ProductTutorialsDisplay tutorials={product.tutorials} />
    </div>
  );
}

export default async function ViewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Next 15 params es una Promesa
  return <ProductDetails id={id} />;
}
