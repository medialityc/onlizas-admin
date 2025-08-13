import { CreateProduct, GetAllProducts, Product, ProductFilter, UpdateProduct } from '@/types/products';
import { ApiResponse, ApiStatusResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import { mockProducts, mockCategories, mockSuppliers } from '@/data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAllProducts (
  params: IQueryable & ProductFilter
): Promise<ApiResponse<GetAllProducts>> {
  await delay(500);

  let filtered = [...mockProducts];

  // Filtro por búsqueda de texto
  if (params?.search && params.search.trim() !== '') {
    const searchTerm = params.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm)) ||
      (p.upcCode && p.upcCode.toLowerCase().includes(searchTerm)) ||
      (p.npnCode && p.npnCode.toLowerCase().includes(searchTerm))
    );
  }

  if (params?.status) {
    filtered = filtered.filter(p => p.status === params.status);
  }
  if (params?.categoryId) {
    filtered = filtered.filter(p => p.categoryId === params.categoryId);
  }
  if (params?.supplierId) {
    filtered = filtered.filter(p => p.supplierIds.includes(params.supplierId!));
  }

  const enrichedData = filtered.map(product => ({
    ...product,
    category: mockCategories.find(c => c.id === product.categoryId)?.name || 'Sin categoría',
    suppliers: product.supplierIds.map(id =>
      mockSuppliers.find(s => s.id === id)?.name
    ).filter(Boolean).join(', ')
  }));

  const page = params?.pagination?.page || 1;
  const pageSize = params?.pagination?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const result: GetAllProducts = {
    data: enrichedData.slice(start, end),
    totalCount: filtered.length,
    page: page,
    pageSize: pageSize,
    hasNext: page * pageSize < filtered.length,
    hasPrevious: page > 1
  };

  return {
    error: false,
    status: 200,
    data: result
  };
}

export async function getProductById (
  id: number
): Promise<ApiResponse<Product>> {
  await delay(300);
  const product = mockProducts.find(p => p.id === id);
  if (!product) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado'
    };
  }

  return {
    error: false,
    status: 200,
    data: product
  };
}

export async function createProduct (
  data: CreateProduct
): Promise<ApiResponse<Product>> {
  await delay(800);
  const newProduct: Product = {
    ...data,
    id: Math.max(...mockProducts.map(p => p.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockProducts.push(newProduct);

  return {
    error: false,
    status: 201,
    data: newProduct
  };
}

export async function updateProduct (
  id: number,
  data: UpdateProduct
): Promise<ApiResponse<Product>> {
  await delay(800);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado'
    };
  }

  mockProducts[index] = {
    ...mockProducts[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  return {
    error: false,
    status: 200,
    data: mockProducts[index]
  };
}

export async function deleteProduct (
  id: number
): Promise<ApiResponse<ApiStatusResponse>> {
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado'
    };
  }
  mockProducts.splice(index, 1);

  return {
    error: false,
    status: 200,
    data: { status: 200 }
  };
}

export async function assignSupplierToProduct (
  productId: number,
  supplierId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  await delay(400);
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado'
    };
  }
  if (!product.supplierIds.includes(supplierId)) {
    product.supplierIds.push(supplierId);
  }

  return {
    error: false,
    status: 200,
    data: { status: 200 }
  };
}

export async function unassignSupplierFromProduct (
  productId: number,
  supplierId: number
): Promise<ApiResponse<ApiStatusResponse>> {
  await delay(400);
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado'
    };
  }
  product.supplierIds = product.supplierIds.filter(id => id !== supplierId);

  return {
    error: false,
    status: 200,
    data: { status: 200 }
  };
}

export async function uploadProductImage (
  productId: number,
  file: File
): Promise<ApiResponse<ApiStatusResponse>> {
  await delay(1000);
  console.log(`Imagen subida para producto ${productId}:`, file.name);

  return {
    error: false,
    status: 200,
    data: { status: 200 }
  };
}