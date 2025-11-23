import { buildQueryParams } from "@/lib/request";
import BannerListContainer from "@/sections/admin/home-banners/containers/banner-list-container";
import { getAllHomeBanner } from "@/services/homebanner";

import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de banners - Onlizas",
  description: "Administra las banners de productos",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function BannerListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const bannerPromise = await getAllHomeBanner(query);

  return <BannerListContainer bannerPromise={bannerPromise} query={params} />;
}

export default BannerListPage;
