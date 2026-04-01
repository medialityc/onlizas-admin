import { detailsObjectToArray, isValidUrl } from "@/utils/format";
import {
  PlusIcon,
  TagIcon,
  CubeIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  ScaleIcon,
  SparklesIcon,
  PlayIcon,
  BuildingLibraryIcon,
  StarIcon,
  CurrencyDollarIcon,
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
  const { watch, setValue, formState } = useFormContext();
  const product = watch("selectedProduct");
  const isDraft = watch("isDraft");
  const isOwned = watch("isOwned");
  console.log(formState.errors);

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
    product?.image &&
    typeof product?.image === "string" &&
    isValidUrl(product?.image)
      ? product?.image
      : defaultImage;

  const hasDetails = product.details && Object.keys(product.details).length > 0;
  const hasDimensions =
    product.length || product.width || product.height || product.weight;
  const hasGeneralInfo =
    product.brand?.name ||
    product.niso ||
    product.source ||
    product.shortDescription ||
    product.quantityValue ||
    product.minimumQuantity ||
    product.points ||
    product.stock;
  const hasCustoms =
    product.customsValue ||
    product.customsValueAduanaUsd ||
    product.aduanaCategory?.name;

  return (
    <div className="bg-blur-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <ImagePreview
            images={[imageUrl]}
            alt={product.name}
            className="w-16 h-16 rounded-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {product.name}
            </h4>
            {product.shortDescription && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5 italic">
                {product.shortDescription}
              </p>
            )}
            {product.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                {product.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
              {product.brand?.name && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                  <SparklesIcon className="w-3 h-3" />
                  {product.brand.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {/* Categorías y proveedores */}
        {(product.categories?.length > 0 || product.suppliers?.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {product.categories?.length > 0 && (
              <>
                <span className="font-semibold text-gray-700 dark:text-gray-300 mr-1">
                  Categorías:
                </span>
                {product.categories.map((category: any) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {category.name}
                  </span>
                ))}
              </>
            )}
            {product.categories?.length > 0 &&
              product.suppliers?.length > 0 && (
                <Separator orientation="vertical" className="h-4 mx-1" />
              )}
            {product.suppliers?.length > 0 && (
              <>
                <span
                  className="font-semibold text-gray-700 dark:text-gray-300 mr-1"
                  title="Proveedores que ya venden este producto."
                >
                  Proveedores:
                </span>
                {product.suppliers.map((supplier: any) => (
                  <span
                    key={supplier.id}
                    className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  >
                    {supplier.name}
                  </span>
                ))}
              </>
            )}
          </div>
        )}

        {/* Información general */}
        {hasGeneralInfo && (
          <div className="rounded-md bg-gray-50 dark:bg-slate-700/30 p-2.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-300">
              <InformationCircleIcon className="w-3.5 h-3.5" />
              Información general
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {product.niso && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    NISO:
                  </span>
                  <span>{product.niso}</span>
                </div>
              )}
              {product.source && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <GlobeAltIcon className="w-3 h-3 shrink-0" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Origen:
                  </span>
                  <span>{product.source}</span>
                </div>
              )}
              {product.quantityValue && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Cantidad:
                  </span>
                  <span>{product.quantityValue}</span>
                </div>
              )}
              {product.minimumQuantity > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Mín. compra:
                  </span>
                  <span>{product.minimumQuantity}</span>
                </div>
              )}
              {product.stock > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Stock:
                  </span>
                  <span>{product.stock}</span>
                </div>
              )}
              {product.points > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <StarIcon className="w-3 h-3 shrink-0 text-amber-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Puntos:
                  </span>
                  <span>{product.points}</span>
                </div>
              )}
              {product.rateXValue > 0 && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Rate x valor:
                  </span>
                  <span>{product.rateXValue}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aduana / Customs */}
        {hasCustoms && (
          <div className="rounded-md bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-2.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
              <BuildingLibraryIcon className="w-3.5 h-3.5" />
              Aduana
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {product.aduanaCategory?.name && (
                <div className="col-span-2 flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Categoría:
                  </span>
                  <span>{product.aduanaCategory.name}</span>
                </div>
              )}
              {product.customsValue > 0 && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <CurrencyDollarIcon className="w-3 h-3 shrink-0 text-amber-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Valor:
                  </span>
                  <span>{product.customsValue}</span>
                </div>
              )}
              {product.customsValueAduanaUsd > 0 && (
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <CurrencyDollarIcon className="w-3 h-3 shrink-0 text-amber-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Valor USD:
                  </span>
                  <span>${product.customsValueAduanaUsd}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Especificaciones */}
        {hasDetails && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Especificaciones
            </p>
            <div className="flex flex-wrap gap-1.5">
              {detailsObjectToArray(product.details)?.map((detail) => (
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
          </div>
        )}

        {/* Dimensiones */}
        {hasDimensions && (
          <div className="rounded-md bg-gray-50 dark:bg-slate-700/30 p-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-300 mb-2">
              <CubeIcon className="w-3.5 h-3.5" />
              Dimensiones
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {product.length > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  Largo: <strong>{product.length}</strong>
                </span>
              )}
              {product.width > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  Ancho: <strong>{product.width}</strong>
                </span>
              )}
              {product.height > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  Alto: <strong>{product.height}</strong>
                </span>
              )}
              {product.weight > 0 && (
                <span className="text-gray-600 dark:text-gray-400">
                  Peso: <strong>{product.weight}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Acerca de este producto */}
        {product.aboutThis && product.aboutThis.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <InformationCircleIcon className="w-3.5 h-3.5" />
              Acerca de este producto
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.aboutThis.map((item: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline-success"
                  className="text-xs font-medium"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tutoriales */}
        {product.tutorials && product.tutorials.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <PlayIcon className="w-3.5 h-3.5" />
              Tutoriales
            </div>
            <ul className="space-y-1">
              {product.tutorials.map((url: string, index: number) => (
                <li key={index}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 underline break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-100 dark:border-slate-700">
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2 items-center text-xs font-medium rounded-md transition-colors flex justify-center gap-1.5">
            <span className="flex-1 flex flex-row gap-2 items-center">
              <CopyIcon className="w-3.5 h-3.5" />
              Usar como plantilla
            </span>
            <RHFSwitch name="isDraft" />
          </div>
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
