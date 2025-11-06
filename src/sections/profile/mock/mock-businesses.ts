import { Business } from "@/types/business";

// Mock businesses for local/testing use. Matches the Business type.
export const mockBusinesses: Business[] = [
  {
    id: 10,
    code: "TD-10",
    name: "Tienda Demo",
    description: "Tienda demo usada para pruebas locales y UI.",
    locationId: 1,
    hblInitial: "HBL-10",
    address: "Calle Falsa 123, Ciudad Demo",
    email: "contacto@tiendademo.local",
    phone: "+53 555-010",
    isPrimary: true,
    fixedRate: 0,
    invoiceText: "Gracias por su compra en Tienda Demo",
    users: [123],
    parentBusiness: { id: 0, name: "" },
    childBusinessIds: [],
    photoObjectCodes: ["/files/mock-business-10-1.jpg"],
    active: true,
  },
];

export function getMockBusinessById(id: number): Business | null {
  const found = mockBusinesses.find((b) => b.id === id);
  return found ?? null;
}
