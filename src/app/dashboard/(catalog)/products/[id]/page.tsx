import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { paths } from "@/config/paths";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/services/products";

async function ProductDetails({ id }: { id: string }) {
  const response = await getProductById(Number(id));
  if (!response?.data) notFound();

  const { image: productImage, ...product } = response.data;

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
            <Button variant="secondary" outline>
              Volver
            </Button>
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

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Categoría:
                  </span>
                  <div className="mt-1">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((category) => (
                        <span
                          key={category.id}
                          className="text-blue-600 font-medium"
                        >
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Sin categoría</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Creado:
                  </span>
                  <div className="mt-1 text-gray-900">2024-01-15</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Estado:
                  </span>
                  <div className="mt-1">
                    <Badge variant={product.state ? "success" : "secondary"}>
                      {product.state ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Actualizado:
                  </span>
                  <div className="mt-1 text-gray-900">2024-01-20</div>
                </div>
              </div>
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
            {product.suppliers.map((supplier) => (
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
      {(product.about && product.about.length > 0) ||
      (product.details && product.details.length > 0) ? (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información adicional
          </h3>

          {product.about && product.about.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Acerca del producto:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.about.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.details && product.details.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Detalles técnicos:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-600">
                      {detail.name}:
                    </span>
                    <span className="text-gray-900">{detail.value}</span>
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
  return <ProductDetails id={id} />;
}
