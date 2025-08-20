import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Badge from "@/components/badge/badge";
import { BuildingStorefrontIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Store, StoreMetric } from "@/types/stores";
import IconGlobe from "@/components/icon/icon-globe";
import { Button } from "@/components/button/button";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { getStoreById } from "@/services/stores";
import { useRouter } from "next/navigation";
import { isValidUrl } from "@/utils/format";

interface DataCardProps {
  store: StoreMetric;

  handleViewStore: (storeData: Store) => void;
  handleEdit: (storeData: Store) => void;
}

export const DataCard = ({
  store,
  //storeData,
  handleViewStore,
  handleEdit,
}: DataCardProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const router = useRouter();

  const formatNumber = (val?: number | null) =>
    typeof val === "number" ? val.toLocaleString() : "0";

  async function fetchStoreData() {
    const response = await getStoreById(store.id);
    if (response && response.data) {
      return response.data;
    }
  }
  const viewUrl = (() => {
    if (store.url && isValidUrl(String(store.url))) return String(store.url);
    if (store.url && /\./.test(String(store.url)))
      return `https://${String(store.url)}`;
    return "https://www.amazon.com/stores/Dell";
  })();

  return (
    <Card
      key={store.id}
      className="h-full min-h-[320px] w-full flex flex-col justify-between p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <CardHeader className="pb-0 flex-shrink-0">
        <div className="relative">
          <div className="absolute top-3 right-3">
            <Badge variant={store.isActive ? "primary" : "outline-primary"}>
              {store.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>

          <div className="flex items-center justify-start space-x-3">
            {store.logo && !hasImageError ? (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                {/* Build absolute URL if backend returns relative path */}

                {/* <Image
                  src={store.logo}
                  alt={`${store.title} logo`}
                  width={48}
                  height={48}
                  className="object-cover"
                  onError={() => setHasImageError(true)}
                  unoptimized
                /> */}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
                <BuildingStorefrontIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}

            <div className="min-w-0">
              <CardTitle className="text-sm md:text-base font-semibold truncate">
                {store.title}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 truncate">
                {store.description ?? store.url ?? "—"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 flex-grow flex flex-col justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <IconGlobe className="w-4 h-4 mr-2 " />
          <span className="text-pretty font-semibold truncate">
            /{store.url ?? "-"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-3">
          <p className="whitespace-nowrap">
            <span className="font-medium">Productos:</span>{" "}
            {formatNumber(store.productCount)}
          </p>
          <p className="whitespace-nowrap">
            <span className="font-medium">Categorías:</span>{" "}
            {formatNumber(store.categoryCount)}
          </p>
          <p className="whitespace-nowrap">
            <span className="font-medium">Visitas/mes:</span>{" "}
            {formatNumber(store.visitCount)}
          </p>
          <p className="whitespace-nowrap">
            <span className="font-medium">Conversión:</span>{" "}
            {typeof store.conversionRate === "number"
              ? `${store.conversionRate}%`
              : "-"}
          </p>

          <p className="whitespace-nowrap">
            <span className="font-medium">Ventas del mes:</span> -
          </p>
          <p className="overflow-hidden whitespace-nowrap">
            <span className="font-medium">Ingresos del mes:</span> -
          </p>
          <p className="whitespace-nowrap">
            <span className="font-medium">Total ventas:</span> -
          </p>
          <p className="whitespace-nowrap">
            <span className="font-medium">Total ingresos:</span> -
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-2">
          <div className="text-xs text-gray-500 hidden sm:block"></div>

          <div className="flex w-full sm:w-auto gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 sm:flex-none inline-flex items-center justify-center px-2 py-1 border rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
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
