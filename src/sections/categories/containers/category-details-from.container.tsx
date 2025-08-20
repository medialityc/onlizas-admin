"use client";

import Link from "next/link";
import { CategoryFormData } from "../schemas/category-schema";
import { paths } from "@/config/paths";
import { Button } from "@/components/button/button";
import Image from "next/image";
import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";

type Props = {
  category: CategoryFormData;
};
const CategoryDetailsContainer = ({ category }: Props) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado con botones */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalles de la categoría</h1>
        <div className="flex gap-2">
          <Link href={paths.dashboard.categories.edit(category?.id as number)}>
            <Button>Editar</Button>
          </Link>
          <Link href={paths.dashboard.categories.list}>
            <Button variant="secondary" outline>
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Información principal del producto */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* Imagen del producto */}
            <div className="w-48 h-48 flex-shrink-0">
              <Image
                src={(category?.image as string) ?? "/placeholder-product.jpg"}
                alt={category.name}
                className="w-full h-full object-cover rounded-lg border bg-gray-50"
                width={192}
                height={192}
              />
            </div>

            {/* Información del producto */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600">
                  {category.description || "Sin descripción disponible"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm font-medium text-gray-500 leading-none">
                      Estado:
                    </p>
                    <Badge
                      variant={category.isActive ? "success" : "secondary"}
                    >
                      {category.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Actualizado:
                    </span>
                    <div className="mt-1 text-gray-900">2024-01-20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* departamento section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2 justify-between">
            <p className="text-sm font-bold">Nombre:</p>
            <p className="text-sm font-normal">{category?.departmentName}</p>
          </div>
        </CardContent>
      </Card>

      {/* features sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Características</CardTitle>
        </CardHeader>
        <CardContent>
          {category?.features?.map((fet) => (
            <div
              key={fet?.featureId}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
            >
              <div className="col-span-1 md:col-span-2 flex flex-row gap-2 justify-between">
                <p className="text-sm font-bold">Nombre:</p>
                <p className="text-sm font-normal">{fet?.featureName}</p>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-row gap-2 justify-between">
                <p className="text-sm font-bold">Descripción:</p>
                <p className="text-sm font-normal">{fet?.featureDescription}</p>
              </div>
              <div className="col-span-1 flex flex-row gap-2 justify-between items-center">
                <p className="text-sm font-bold">Obligatoria:</p>
                <Badge variant={fet.isRequired ? "success" : "secondary"}>
                  {fet.isRequired ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="col-span-1 flex flex-row gap-2 justify-between items-center">
                <p className="text-sm font-bold">Principal:</p>
                <Badge variant={fet.isRequired ? "success" : "secondary"}>
                  {fet.isRequired ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              {/* suggestion */}
              {fet?.suggestions && (
                <div className="col-span-1 md:col-span-2 gap-2">
                  <p className="text-sm font-bold">Sugerencias:</p>
                  <div className="flex flex-row flex-wrap gap-2">
                    {fet?.suggestions?.map((sug) => (
                      <Badge key={sug} variant={"outline-primary"}>
                        {sug}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryDetailsContainer;
