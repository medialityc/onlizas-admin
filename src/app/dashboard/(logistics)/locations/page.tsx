import { buildQueryParams } from "@/lib/request";
import LocationsListContainer from "@/sections/locations/list/locations-list-container";
import { getAllLocations } from "@/services/locations";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Gestión de Localizaciones - Onlizas",
  description:
    "Administra las localizaciones del sistema y sus datos asociados",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

async function LocationsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const locationsPromise = await getAllLocations(query);

  return (
    <LocationsListContainer
      locationsPromise={locationsPromise}
      query={params}
    />
  );
}

export default LocationsListPage;
