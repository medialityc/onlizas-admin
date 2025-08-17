
import { ApiResponse } from "@/types/fetch/api";
import { Store } from "../types/stores";

 const stores: Store[] = [
  {
    id: 1,
    supplierId: "1",
    url:"techstore-premium",
    name: "Tienda Central",
    description: "La tienda principal de la empresa.",
    isActive: true,
    ownerId: "user-1",
    logo: "/assets/images/store1.png",
    contact: {
      email: "central@tienda.com",
      phone: "+52 555 123 4567"
    },
    address: {
      street: "Av. Principal 123",
      city: "Ciudad de México",
      country: "México"
    },
    appearance: {
      primaryColor: "#1E90FF",
      secondaryColor: "#FFD700",
      accentColor: "#FF6347",
      font: "Roboto",
      template: "classic"
    },
    banners: [
      {
        id: 1,
        title: "¡Gran Venta!",
        image: "/assets/images/banner1.jpg",
        url: "/ofertas",
        position: "hero",
        startDate: "2025-08-01T00:00:00Z",
        endDate: "2025-08-31T23:59:59Z",
        isActive: true
      }
    ],
    promotions: [
      {
        id: 1,
        title: "Descuento 10%",
        type: "percentage",
        value: "10",
        usageLimit: 100,
        usageCount: 10,
        startDate: "2025-08-01T00:00:00Z",
        endDate: "2025-08-31T23:59:59Z",
        isActive: true
      }
    ],
    categories: [
      {
        id: 1,
        name: "Electrónica",
        description: "Productos electrónicos y gadgets.",
        image: "/assets/images/electronics.png",
        isActive: true,
        department: { id: 1, name: "Tecnología" },
        totalProducts: 120,
        activeProducts: 100,
        productsWithStock: 90
      }
    ],
    metrics: {
      totalProducts: 120,
      views: 5000,
      sales: 350,
      income: 150000,
      monthlyVisits: 2000,
      conversionRate: 0.07,
      totalCategories: 5
    },
    ventasDelMes: 120,
    ingresosDelMes: 48000,
    totalVentas: 350,
    totalIngresos: 150000
  },
  {
    id: 2,
    url:"techstore-premium",
    supplierId: "1",
    name: "Sucursal Norte",
    description: "Tienda ubicada en la zona norte.",
    isActive: false,
    ownerId: "user-2",
    logo: "/assets/images/image.png",
    contact: {
      email: "norte@tienda.com",
      phone: "+52 555 987 6543"
    },
    address: {
      street: "Calle Norte 456",
      city: "Monterrey",
      country: "México"
    },
    appearance: {
      primaryColor: "#228B22",
      secondaryColor: "#FF69B4",
      accentColor: "#8A2BE2",
      font: "Open Sans",
      template: "modern"
    },
    banners: [],
    promotions: [],
    categories: [],
    metrics: {
      totalProducts: 0,
      views: 0,
      sales: 0,
      income: 0,
      monthlyVisits: 0,
      conversionRate: 0,
      totalCategories: 0
    },
    ventasDelMes: 0,
    ingresosDelMes: 0,
    totalVentas: 0,
    totalIngresos: 0
  }
];
export type GetAllStoresResponse = {
  data: Store[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};
const dataMock: GetAllStoresResponse = {
  data: stores,
  page: 1,
  pageSize: stores.length,
  totalCount: stores.length,
  hasNext: false,
  hasPrevious: false,
};

export const mockStores: ApiResponse<GetAllStoresResponse> = {
  status: 200,
  error: false,
  data: dataMock,
  detail: "",
  message: "",
  title: "",
};