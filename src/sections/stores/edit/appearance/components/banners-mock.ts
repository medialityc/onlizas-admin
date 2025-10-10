export type HomeBannerItem = {
  id: number;
  title: string;
  url: string;
  position: number; // numeric position for backend
  startDate?: string | null; // ISO date string
  endDate?: string | null;   // ISO date string
  image?: File | string | null;
  active: boolean;
};

export const mockHomeBanners: HomeBannerItem[] = [
  {
    id: 1,
    title: "Oferta Especial Laptops",
    url: "/ofertas/laptops",
  position: 1,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    image: null,
    active: true,
  },
  {
    id: 2,
    title: "Nuevos Smartphones",
    url: "/productos/smartphones",
  position: 3,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    image: null,
    active: false,
  },
];
