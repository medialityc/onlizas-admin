import { Product, ProductCategory, ProductSupplier } from '@/types/products';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    description: 'Laptop ultradelgada con procesador Intel Core i7',
    isActive: true,
    suppliers: [
      { id: 1, name: 'TechCorp' },
      { id: 2, name: 'ElectroMax' }
    ],
    categories: [
      { id: 1, name: 'Laptops' }
    ],
    dimensions: {
      width: 30,
      height: 2,
      lenght: 20 // Note: API uses "lenght" not "length"
    },
    about: [
      'Ultradelgada y portátil',
      'Ideal para profesionales',
      'Pantalla 4K de alta resolución',
      'Batería de larga duración'
    ],
    details: [
      { name: 'Procesador', value: 'Intel Core i7-1165G7' },
      { name: 'RAM', value: '16GB DDR4' },
      { name: 'Almacenamiento', value: '512GB SSD' },
      { name: 'Peso', value: '1.2 kg' },
      { name: 'Garantía', value: '2 años' }
    ],
    features: [
      { id: 1, name: 'Voltaje', values: ['120V', '240V'] },
      { id: 2, name: 'Color', values: ['Plata'] },
      { id: 3, name: 'Tamaño de Pantalla', values: ['13 pulgadas'] }
    ],
    images: [
      { image: '/images/laptop1.jpg', order: 1 },
      { image: '/images/laptop1-side.jpg', order: 2 }
    ]
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: 'Smartphone premium con chip A17 Pro',
    isActive: true,
    suppliers: [
      { id: 1, name: 'TechCorp' }
    ],
    categories: [
      { id: 2, name: 'Smartphones' }
    ],
    dimensions: {
      width: 7.08,
      height: 14.76,
      lenght: 0.83
    },
    about: [
      'Smartphone premium de última generación',
      'Chip A17 Pro de alto rendimiento',
      'Construcción en titanio',
      'Sistema de cámaras profesional'
    ],
    details: [
      { name: 'Chip', value: 'A17 Pro' },
      { name: 'Pantalla', value: '6.1 pulgadas Super Retina XDR' },
      { name: 'Cámara', value: 'Sistema de cámaras Pro de 48 MP' },
      { name: 'Peso', value: '187 gramos' },
      { name: 'Garantía', value: '1 año' }
    ],
    features: [
      { id: 4, name: 'Capacidad', values: ['128GB', '256GB', '512GB', '1TB'] },
      { id: 5, name: 'Color', values: ['Titanio Natural', 'Titanio Azul', 'Titanio Blanco', 'Titanio Negro'] },
      { id: 6, name: 'Conectividad', values: ['USB-C', '5G', 'WiFi 6E'] }
    ],
    images: [
      { image: '/images/iphone1.jpg', order: 1 },
      { image: '/images/iphone1-back.jpg', order: 2 }
    ]
  },
  {
    id: 3,
    name: 'Monitor Samsung 27"',
    description: 'Monitor 4K para gaming y productividad',
    isActive: false,
    suppliers: [
      { id: 2, name: 'ElectroMax' },
      { id: 3, name: 'DigitalWorld' }
    ],
    categories: [
      { id: 3, name: 'Monitores' }
    ],
    dimensions: {
      width: 61,
      height: 40,
      lenght: 20
    },
    about: [
      'Monitor 4K de alta resolución',
      'Ideal para gaming y trabajo profesional',
      'Tecnología HDR10 integrada',
      'Compatible con FreeSync'
    ],
    details: [
      { name: 'Resolución', value: '3840 x 2160' },
      { name: 'Frecuencia de actualización', value: '144Hz' },
      { name: 'Tipo de panel', value: 'IPS' },
      { name: 'Conectividad', value: 'HDMI 2.1, DisplayPort 1.4, USB-C' },
      { name: 'Garantía', value: '3 años' }
    ],
    features: [
      { id: 7, name: 'Tamaño', values: ['27 pulgadas'] },
      { id: 8, name: 'Tecnologías', values: ['4K', 'HDR10', 'FreeSync'] },
      { id: 9, name: 'Conectores', values: ['HDMI', 'DisplayPort', 'USB-C'] }
    ],
    images: [
      { image: '/images/monitor1.jpg', order: 1 },
      { image: '/images/monitor1-angle.jpg', order: 2 }
    ]
  }
];

export const mockCategories: ProductCategory[] = [
  { id: 1, name: 'Laptops' },
  { id: 2, name: 'Smartphones' },
  { id: 3, name: 'Monitores' }
];

export const mockSuppliers: ProductSupplier[] = [
  { id: 1, name: 'TechCorp' },
  { id: 2, name: 'ElectroMax' },
  { id: 3, name: 'DigitalWorld' }
];