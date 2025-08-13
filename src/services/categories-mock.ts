import { mockCategories } from '@/data/products';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockCategoryService = {
  getAll: async () => {
    await delay(200);
    return mockCategories;
  }
};