export type BannerItem = {
  id: number;
  title: string;
  url: string;
  position: "hero" | "sidebar" | "slideshow";
  startDate?: string | null; // ISO date string
  endDate?: string | null;   // ISO date string
  image?: File | string | null;
  isActive: boolean;
};

export const mockBanners: BannerItem[] = [
  {
    id: 1,
    title: "Oferta Especial Laptops",
    url: "/ofertas/laptops",
    position: "hero",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    image: null,
    isActive: true,
  },
  {
    id: 2,
    title: "Nuevos Smartphones",
    url: "/productos/smartphones",
    position: "slideshow",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    image: null,
    isActive: false,
  },
];
