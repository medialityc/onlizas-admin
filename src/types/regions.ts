// Minimal types for Regions: keep surface small so it's easy to evolve.

export interface Region {
  id: number;
  code: string; // Código único en mayúsculas (LATAM, EU, NA)
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  // Optional associations for read models (details view)
  countries?: Array<{ id: number; name: string; code: string }>;
}

// Payload expected by create/update requests (keep as the single request type).
export interface RegionFormData {
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  countryIds: number[]; // Países asociados
}