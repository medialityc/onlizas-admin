import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge";
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  SwatchIcon,
  RectangleStackIcon,
  PaintBrushIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Store } from "@/types/stores";

import { Button } from "@/components/button/button";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatNumber, formatPercentage, isValidUrl } from "@/utils/format";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type DataCardProps = {
  store: Store;
};

export const DataCard = ({ store }: DataCardProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [hasBannerError, setHasBannerError] = useState(false);
  const router = useRouter();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE,PERMISSION_ENUM.RETRIEVE_SECTION]);

  // Prefer https:// if not present
  const viewUrl = (() => {
    if (store.url && isValidUrl(store.url)) return store.url;
    if (store.url && /\./.test(store.url)) return `https://${store.url}`;
    return "#";
  })();

  const accentColor =
    store.primaryColor || store.secondaryColor || store.accentColor;
  const firstBanner =
    Array.isArray(store.banners) && store.banners.length > 0
      ? (store.banners[0] as any)
      : undefined;
  const bannerUrl =
    typeof firstBanner === "string"
      ? firstBanner
      : firstBanner?.url || firstBanner?.image || undefined;

  return (
    <Card
      key={store.id}
      className="group py-0 h-full min-h-[340px] w-full flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 dark:shadow-none dark:hover:shadow-lg bg-white dark:bg-gray-900"
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      {/* Decorative header: banner or fallback gradient */}
      <div className="relative h-20 w-full overflow-hidden">
        {bannerUrl && !hasBannerError ? (
          <>
            <Image
              src={bannerUrl}
              alt={store.name + " banner"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setHasBannerError(true)}
            />
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-blue-100 to-indigo-100 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900" />
            <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_0)] [background-size:12px_12px]" />
          </>
        )}
      </div>

      {/* Header content */}
      <CardHeader className="pt-0 pb-0">
        <div className="relative -mt-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar / Logo */}
            <div
              className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center"
              style={accentColor ? { borderColor: accentColor } : undefined}
            >
              {store.logoStyle && !hasImageError ? (
                <Image
                  src={store.logoStyle}
                  alt={store.name + " logo"}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                  onError={() => setHasImageError(true)}
                />
              ) : (
                <BuildingStorefrontIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold truncate">
                {store.name}
              </CardTitle>
              {store.businessName && (
                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {store.businessName}
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <Badge variant={store.active ? "primary" : "outline-primary"}>
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${store.active ? "bg-green-500" : "bg-gray-400"}`}
              />
              {store.active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 flex-grow flex flex-col justify-between">
        {/* Quick details (compact tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {store.url && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <GlobeAltIcon className="w-4 h-4" />
              </span>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium truncate hover:underline"
                title={viewUrl}
              >
                /{store.url}
              </a>
            </div>
          )}

          {store.email && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <EnvelopeIcon className="w-4 h-4" />
              </span>
              <span className="truncate">{store.email}</span>
            </div>
          )}

          {store.phoneNumber && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <PhoneIcon className="w-4 h-4" />
              </span>
              <span className="truncate">{store.phoneNumber}</span>
            </div>
          )}

          {(store.primaryColor ||
            store.secondaryColor ||
            store.accentColor) && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <SwatchIcon className="w-4 h-4" />
              </span>
              <div className="flex items-center gap-2">
                {store.primaryColor && (
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: store.primaryColor }}
                    title={`Primary ${store.primaryColor}`}
                  />
                )}
                {store.secondaryColor && (
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: store.secondaryColor }}
                    title={`Secondary ${store.secondaryColor}`}
                  />
                )}
                {store.accentColor && (
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: store.accentColor }}
                    title={`Accent ${store.accentColor}`}
                  />
                )}
              </div>
            </div>
          )}

          {store.template && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <RectangleStackIcon className="w-4 h-4" />
              </span>
              <span className="truncate">{store.template}</span>
            </div>
          )}

          {store.font && (
            <div className="flex items-center gap-2 rounded-md border bg-white dark:border-gray-700 dark:bg-gray-800 p-2 text-xs">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-50 dark:bg-slate-900"
                style={accentColor ? { color: accentColor } : undefined}
              >
                <PaintBrushIcon className="w-4 h-4" />
              </span>
              <span className="truncate">{store.font}</span>
            </div>
          )}
        </div>
        {/* KPIs (solo si existen en el tipado) */}
        {store.metrics && (
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
                  {formatNumber(store.metrics.totalProducts ?? 0)}
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
                  {formatNumber(store.metrics.totalCategories ?? 0)}
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
                  {formatNumber(store.metrics.monthlyVisits ?? 0)}
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
                  {typeof store.metrics.conversionRate === "number"
                    ? formatPercentage(store.metrics.conversionRate)
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Footer actions */}
        <div className="flex w-full items-center gap-2 mt-4 pb-4">
          {store.url && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              aria-label="Ver tienda pública"
            >
              <EyeIcon className="w-4 h-4 mr-1" /> Ver
            </a>
          )}
          {hasUpdatePermission && (
            <Button
              onClick={() => router.push(`/provider/stores/${store.id}`)}
              className="flex-1"
              size="sm"
            >
              <Cog6ToothIcon className="w-4 h-4 mr-1" /> Configurar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
