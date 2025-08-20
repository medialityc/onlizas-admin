import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge";
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { StoreMetric } from "@/types/stores";
import IconGlobe from "@/components/icon/icon-globe";
import { Button } from "@/components/button/button";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidUrl } from "@/utils/format";

interface DataCardProps {
  store: StoreMetric;
}

export const DataCard = ({ store }: DataCardProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const router = useRouter();

  const formatNumber = (val?: number | null) =>
    typeof val === "number" ? val.toLocaleString() : "0";

  const viewUrl = (() => {
    if (store.url && isValidUrl(String(store.url))) return String(store.url);
    if (store.url && /\./.test(String(store.url)))
      return `https://${String(store.url)}`;
    return "https://www.amazon.com/stores/Dell";
  })();

  return (
    <Card
      key={store.id}
      className="group py-0 h-full min-h-[340px] w-full flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 dark:shadow-none dark:hover:shadow-lg bg-white dark:bg-gray-900"
    >
      {/* Decorative header */}
      <div className="relative h-20 w-full bg-gradient-to-r from-primary/15 via-blue-100 to-indigo-100 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_0)] [background-size:12px_12px]" />
      </div>

      {/* Header content */}
      <CardHeader className="pt-0 pb-0">
        <div className="relative -mt-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar / Logo */}
            <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
              {store.logo && !hasImageError ? (
                <Image
                  src={store.logo}
                  alt={`${store.title} logo`}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  onError={() => setHasImageError(true)}
                  unoptimized
                />
              ) : (
                <BuildingStorefrontIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {store.title}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {store.description ?? store.url ?? "—"}
              </CardDescription>
            </div>
          </div>
          <div className="shrink-0">
            <Badge variant={store.isActive ? "primary" : "outline-primary"}>
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${store.isActive ? "bg-green-500" : "bg-gray-400"}`}
              />
              {store.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 flex-grow flex flex-col justify-between">
        {/* URL badge */}
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded px-2 py-1 w-fit">
          <IconGlobe className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium truncate hover:underline dark:text-gray-200"
            title={viewUrl}
          >
            /{store.url ?? "-"}
          </a>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <ShoppingCartIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Productos
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {formatNumber(store.productCount)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <Squares2X2Icon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Categorías
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {formatNumber(store.categoryCount)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
              <EyeIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Visitas/mes
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {formatNumber(store.visitCount)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Conversión
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {typeof store.conversionRate === "number"
                  ? `${store.conversionRate}%`
                  : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pb-4">
          <div className="text-xs text-gray-500 hidden sm:block" />
          <div className="flex w-full sm:w-auto gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 sm:flex-none inline-flex items-center justify-center px-3 py-1.5 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              aria-label="Ver tienda pública"
            >
              <EyeIcon className="w-4 h-4 mr-1" /> Ver
            </a>
            <Button
              onClick={() => router.push(`/provider/stores/${store.id}`)}
              className="w-full sm:w-auto flex-1 sm:flex-none"
              size="sm"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-1" /> Configurar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
