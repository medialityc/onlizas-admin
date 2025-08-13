import { Product } from '@/types/products';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    description: 'Laptop ultradelgada con procesador Intel Core i7',
    categoryId: 1,
    status: 'active',
    upcCode: '123456789012',
    npnCode: 'NPN001',
    images: [
      { id: 1, url: '/images/laptop1.jpg', isMain: true, order: 1 }
    ],
    variants: { weight: 1.2, color: 'Plata' },
    specifications: [
      { key: 'Procesador', value: 'Intel Core i7-1165G7' },
      { key: 'RAM', value: '16GB DDR4' },
      { key: 'Almacenamiento', value: '512GB SSD' }
    ],
    featuredCharacteristics: ['Ultradelgada', 'Pantalla 4K', 'Batería larga duración'],
    dimensions: { height: 2, width: 30, depth: 20, unit: 'cm' },
    warranty: '2 años',
    supplierIds: [1, 2],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: 'Smartphone premium con chip A17 Pro',
    categoryId: 2,
    status: 'active',
    upcCode: '234567890123',
    npnCode: 'NPN002',
    images: [
      { id: 2, url: '/images/iphone1.jpg', isMain: true, order: 1 }
    ],
    variants: { weight: 0.187, color: 'Titanio Natural', size: '128GB' },
    specifications: [
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Pantalla', value: '6.1 pulgadas Super Retina XDR' },
      { key: 'Cámara', value: 'Sistema de cámaras Pro de 48 MP' }
    ],
    featuredCharacteristics: ['Titanio', 'USB-C', 'Cámara Pro'],
    dimensions: { height: 14.76, width: 7.08, depth: 0.83, unit: 'cm' },
    warranty: '1 año',
    supplierIds: [1],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  },
  {
    id: 3,
    name: 'Monitor Samsung 27"',
    description: 'Monitor 4K para gaming y productividad',
    categoryId: 3,
    status: 'inactive',
    upcCode: '345678901234',
    images: [
      { id: 3, url: '/images/monitor1.jpg', isMain: true, order: 1 }
    ],
    specifications: [
      { key: 'Resolución', value: '3840 x 2160' },
      { key: 'Frecuencia', value: '144Hz' },
      { key: 'Panel', value: 'IPS' }
    ],
    featuredCharacteristics: ['4K', 'HDR10', 'FreeSync'],
    dimensions: { height: 40, width: 61, depth: 20, unit: 'cm' },
    warranty: '3 años',
    supplierIds: [2, 3],
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-25T09:15:00Z'
  }
];

export const mockCategories = [
  { id: 1, name: 'Laptops' },
  { id: 2, name: 'Smartphones' },
  { id: 3, name: 'Monitores' }
];

export const mockSuppliers = [
  { id: 1, name: 'TechCorp' },
  { id: 2, name: 'ElectroMax' },
  { id: 3, name: 'DigitalWorld' }
];