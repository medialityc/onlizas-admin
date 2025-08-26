export type BannerItem = {
  id: number;
  title: string;
  urlDestinity: string;
  position: number | string; // integer position
  startDate?: string | null; // ISO date string
  endDate?: string | null;   // ISO date string
  image?: File | string | null;
  isActive: boolean;
};

export const mockBanners: BannerItem[] = [
  {
    id: 1,
    title: "Oferta Especial Laptops",
    urlDestinity: "/ofertas/laptops",
    position: 1,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    image: null,
    isActive: true,
  },
  {
    id: 2,
    title: "Nuevos Smartphones",
    urlDestinity: "/productos/smartphones",
    position: 2,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    image: null,
    isActive: false,
  },
];
