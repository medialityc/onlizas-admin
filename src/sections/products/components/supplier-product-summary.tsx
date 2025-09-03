import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import {
  PlusIcon,
  TagIcon,
  CubeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import ImagePreview from "@/components/image/image-preview";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import Badge from "@/components/badge/badge";
import { Separator } from "@/components/ui/separator";
import { RHFSwitch } from "@/components/react-hook-form";
import { CopyIcon, PackageIcon } from "lucide-react";
import { useCallback } from "react";

type Props = {
  onSubmitLink: any;
  isLoading: boolean;
};

const SupplierProductSummary = ({ onSubmitLink, isLoading }: Props) => {
  const { watch, setValue } = useFormContext();
  const product = watch("selectedProduct");
  const isDraft = watch("isDraft");
  const isOwned = watch("isOwned");

  const handleCreate = useCallback(() => {
    setValue("isDraft", true, { shouldDirty: true });
  }, [setValue]);

  if (!product?.id) {
    return (
      <div className="bg-blur-card flex flex-col gap-2 justify-center items-center">
        <PackageIcon className="w-10 h-10" />
        <h2 className="text-lg">¿No encuentras lo que buscas?</h2>
        <p>Crea un producto completamente nuevo desde cero</p>
        <Button onClick={handleCreate}>
          <PlusIcon className="h-4 w-4 mr-2" /> Crear producto nuevo
        </Button>
      </div>
    );
  }

  const defaultImage = "/assets/images/placeholder-product.webp";
  const imageUrl =
    product?.mainImage &&
    typeof product?.mainImage === "string" &&
    isValidUrl(product?.mainImage)
      ? product?.mainImage
      : defaultImage;

  const hasDetails = product.details && Object.keys(product.details).length > 0;
  const hasDimensions =
    product.length || product.width || product.height || product.weight;

  return (
    <div className="bg-blur-card">
      {/* Header compacto */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <ImagePreview
            images={[imageUrl]}
            alt={product.name}
            className="w-16 h-16 rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {product.name}
            </h4>
            {product.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                {product.description}
              </p>
            )}
            {/* Estado compacto */}
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                product.state
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full mr-1 ${
                  product.state ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {product.state ? "Activo" : "Inactivo"}
            </div>
          </div>
        </div>
      </div>

      {/* Información condensada */}
      <div className="p-4 space-y-3">
        {/* Categorías y proveedores en una línea */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {product.categories?.map((category: any) => (
            <span
              key={category.id}
              className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {category.name}
            </span>
          ))}
          {product.suppliers?.map((supplier: any) => (
            <span
              key={supplier.id}
              className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
            >
              {supplier.name}
            </span>
          ))}
        </div>

        {/* Especificaciones en grid compacto */}
        {hasDetails && (
          <div className="flex flex-wrap gap-2">
            {detailsObjectToArray(product.details)
              ?.slice(0, 4)
              .map((detail) => (
                <Badge
                  key={detail.key}
                  variant="outline-dark"
                  className="flex items-center gap-1 text-xs"
                >
                  <span className="text-gray-500 dark:text-gray-400 truncate">
                    {detail.key}:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {detail.value}
                  </span>
                </Badge>
              ))}
          </div>
        )}

        {/* Dimensiones compactas */}
        {hasDimensions && (
          <div className="flex items-center justify-between text-xs bg-gray-50 dark:bg-slate-700/30 rounded-md p-2">
            <div className="flex flex-row gap-2 items-center">
              <CubeIcon className="w-3 h-3 text-gray-400" />
              Dimensiones
            </div>
            <div className="flex gap-3">
              {product.length && (
                <span className="text-gray-600 dark:text-gray-400">
                  Largo: {product.length}
                </span>
              )}
              <Separator orientation="vertical" className="h-4" />
              {product.width && (
                <span className="text-gray-600 dark:text-gray-400">
                  Ancho: {product.width}
                </span>
              )}
              <Separator orientation="vertical" className="h-4" />
              {product.height && (
                <span className="text-gray-600 dark:text-gray-400">
                  Alto: {product.height}
                </span>
              )}
              <Separator orientation="vertical" className="h-4" />
              {product.weight && (
                <span className="text-gray-600 dark:text-gray-400">
                  Peso: {product.weight}
                </span>
              )}
            </div>
          </div>
        )}

        {/* About this - solo primeros elementos */}
        {product.aboutThis && product.aboutThis.length > 0 && (
          <div className="flex items-center justify-between text-xs bg-gray-50 dark:bg-slate-700/30 rounded-md p-2">
            <div className="flex flex-row gap-2 items-center">
              <InformationCircleIcon className="w-3 h-3 text-gray-400" />
              Acerca de este producto
            </div>
            <div className="flex gap-3">
              {product.aboutThis
                .slice(0, 4)
                .map((item: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline-success"
                    className="text-xs font-medium"
                  >
                    {item}
                  </Badge>
                ))}
              {product.aboutThis.length > 4 && (
                <Badge
                  variant="outline-success"
                  className="text-xs font-medium"
                >
                  ...
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botones compactos */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            outline
            className="flex-1 px-3 py-2 items-center text-xs font-medium rounded-md transition-colors flex  justify-center gap-1.5"
          >
            <span className="flex-1 flex flex-row gap-2 items-center">
              <CopyIcon className="w-3.5 h-3.5" />
              Usar como plantilla
            </span>
            <RHFSwitch name="isDraft" />
          </Button>
          <LoaderButton
            disabled={isDraft || isOwned}
            loading={isLoading}
            onClick={onSubmitLink}
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Agregar este producto
          </LoaderButton>
        </div>
      </div>
    </div>
  );
};

export default SupplierProductSummary;
