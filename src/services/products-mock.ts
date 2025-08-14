import {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
  ProductFilter,
  ProductApiResponse,
} from '@/types/products';
import { ApiResponse } from '@/types/fetch/api';
import { mockProducts, mockCategories, mockSuppliers } from '@/data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simula la base de datos de productos
let productsDB: Product[] = [...mockProducts];

export async function getAllProducts (
  params: ProductFilter
): Promise<ApiResponse<ProductApiResponse>> {
  await delay(500);

  let filtered = [...productsDB];

  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  if (params?.isActive !== undefined) {
    filtered = filtered.filter(p => p.isActive === params.isActive);
  }

  if (params?.categoryId) {
    filtered = filtered.filter(p => p.categories.some(c => c.id === params.categoryId));
  }

  if (params?.supplierId) {
    filtered = filtered.filter(p => p.suppliers.some(s => s.id === params.supplierId));
  }

  const pageNumber = params.pageNumber || 1;
  const pageSize = params.pageSize || 10;
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedData = filtered.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const response: ProductApiResponse = {
    data: paginatedData,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPreviousPage: pageNumber > 1,
  };

  return {
    error: false,
    status: 200,
    data: response,
  };
}

export async function getProductById (
  id: number
): Promise<ApiResponse<Product>> {
  await delay(300);
  const product = productsDB.find(p => p.id === id);

  if (!product) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado',
    };
  }

  return {
    error: false,
    status: 200,
    data: product,
  };
}

export async function createProduct (
  data: CreateProductRequest
): Promise<ApiResponse<Product>> {
  await delay(800);

  const newId = Math.max(...productsDB.map(p => p.id), 0) + 1;

  const newProduct: Product = {
    id: newId,
    ...data,
    categories: data.categoryIds.map(id => {
      const category = mockCategories.find(c => c.id === id);
      return { id: category!.id, name: category!.name };
    }),
    suppliers: data.supplierIds.map(id => {
      const supplier = mockSuppliers.find(s => s.id === id);
      return { id: supplier!.id, name: supplier!.name };
    }),
    features: [],
    images: [],
  };

  productsDB.push(newProduct);

  return {
    error: false,
    status: 201,
    data: newProduct,
  };
}

export async function updateProduct (
  id: number,
  data: UpdateProductRequest
): Promise<ApiResponse<Product>> {
  await delay(800);
  const index = productsDB.findIndex(p => p.id === id);

  if (index === -1) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado',
    };
  }

  const existingProduct = productsDB[index];

  const { features, images, categoryIds, supplierIds, ...restOfData } = data;

  const updatedProduct: Product = {
    ...existingProduct,
    ...restOfData,
    categories: categoryIds
      ? categoryIds.map(catId => {
        const category = mockCategories.find(c => c.id === catId);
        if (!category) throw new Error(`Mock Error: Category with id ${catId} not found`);
        return { id: category.id, name: category.name };
      })
      : existingProduct.categories,
    suppliers: supplierIds
      ? supplierIds.map(supId => {
        const supplier = mockSuppliers.find(s => s.id === supId);
        if (!supplier) throw new Error(`Mock Error: Supplier with id ${supId} not found`);
        return { id: supplier.id, name: supplier.name };
      })
      : existingProduct.suppliers,
    // Por ahora, el mock no transforma las características o imágenes, solo las mantiene.
    features: existingProduct.features,
    images: existingProduct.images,
  };

  productsDB[index] = updatedProduct;

  return {
    error: false,
    status: 200,
    data: updatedProduct,
  };
}

export async function deleteProduct (
  id: number
): Promise<ApiResponse<null>> {
  await delay(500);
  const index = productsDB.findIndex(p => p.id === id);

  if (index === -1) {
    return {
      error: true,
      status: 404,
      message: 'Producto no encontrado',
    };
  }

  productsDB.splice(index, 1);

  return {
    error: false,
    status: 204, // No Content
    data: null,
  };
}