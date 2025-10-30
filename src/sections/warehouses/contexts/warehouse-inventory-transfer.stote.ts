import { create } from "zustand";

interface ProductDetail {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  productName: string;
  details: ProductDetail[];
  images: string[];
  stock: number;
  count: number;
  allowPartialFulfillment: boolean;
}

export interface Inventory {
  parentProductName: string;
  supplierName: string;
  totalStock: number;
  products: Product[];
  price: number;
  id: string;
}

export interface RequestItem {
  productVariantId: string;
  inventoryId: string;
  parentProductName: string;
  variantName: string;
  quantityRequested: number;
  unit: string;
  allowPartialFulfillment: boolean;
}

interface InventoryStore {
  inventories: Inventory[];
  items: RequestItem[];

  // Acciones esenciales
  addInventory: (inventory: Inventory) => void;
  removeInventory: (inventoryId: string) => void;
  updateProductCount: (
    inventoryId: string,
    productId: string,
    count: number
  ) => void;
  selectAllProducts: (inventoryId?: string) => void;
  resetInventory: (inventoryId?: string) => void;
  addSelectedProductsToItems: () => void;
  removeItemsByInventory: (inventoryId: string) => void;
  toggleAllowPartialFulfillment: (
    inventoryId: string,
    productId: string
  ) => void;
  resetStore: () => void;

  // Getter esencial
  getInventoryTotalSelected: (inventoryId: string) => number;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  items: [],

  // Agregar un nuevo inventario
  addInventory: (inventory) => {
    set((state) => {
      const inventoryWithDefaults = {
        ...inventory,
        products: inventory.products.map((product) => ({
          ...product,
          count: product.count || 0,
        })),
      };

      return {
        inventories: [...state.inventories, inventoryWithDefaults],
      };
    });
  },

  // Eliminar un inventario completo y sus items relacionados
  removeInventory: (inventoryId) => {
    set((state) => ({
      inventories: state.inventories.filter(
        (inventory) => inventory.id !== inventoryId
      ),
      items: state.items.filter((item) => item.inventoryId !== inventoryId),
    }));
  },

  // Actualizar la cantidad seleccionada de un producto específico
  updateProductCount: (inventoryId, productId, count) => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => {
        if (inventory.id === inventoryId) {
          const updatedProducts = inventory.products.map((product) => {
            if (product.id === productId) {
              const newCount = Math.max(0, Math.min(count, product.stock));
              return { ...product, count: newCount };
            }
            return product;
          });

          return { ...inventory, products: updatedProducts };
        }
        return inventory;
      }),
    }));
  },

  // Seleccionar todas las cantidades disponibles
  selectAllProducts: (inventoryId) => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => {
        if (!inventoryId || inventory.id === inventoryId) {
          return {
            ...inventory,
            products: inventory.products.map((product) => ({
              ...product,
              count: product.stock,
            })),
          };
        }
        return inventory;
      }),
    }));
  },

  // Restablecer inventario y eliminar items relacionados
  resetInventory: (inventoryId) => {
    set((state) => {
      const updatedInventories = state.inventories.map((inventory) => {
        if (!inventoryId || inventory.id === inventoryId) {
          return {
            ...inventory,
            products: inventory.products.map((product) => ({
              ...product,
              count: 0,
            })),
          };
        }
        return inventory;
      });

      const updatedItems = inventoryId
        ? state.items.filter((item) => item.inventoryId !== inventoryId)
        : [];

      return {
        inventories: updatedInventories,
        items: updatedItems,
      };
    });
  },

  // Agregar productos seleccionados al array de items
  addSelectedProductsToItems: () => {
    const { inventories, items } = get();

    inventories.forEach((inventory) => {
      inventory.products.forEach((product) => {
        const existingItemIndex = items.findIndex(
          (item) =>
            item.productVariantId === product.id &&
            item.inventoryId === inventory.id
        );

        if (product.count > 0) {
          if (existingItemIndex >= 0) {
            set((state) => ({
              items: state.items.map((item, index) =>
                index === existingItemIndex
                  ? {
                      ...item,
                      quantityRequested: product.count,
                      allowPartialFulfillment: product.allowPartialFulfillment,
                    }
                  : item
              ),
            }));
          } else {
            set((state) => ({
              items: [
                ...state.items,
                {
                  productVariantId: product.id,
                  parentProductName: inventory.parentProductName,
                  variantName: product?.productName,
                  inventoryId: inventory.id,
                  quantityRequested: product.count,
                  allowPartialFulfillment: product.allowPartialFulfillment,
                  unit: "UM",
                },
              ],
            }));
          }
        } else if (product.count === 0 && existingItemIndex >= 0) {
          set((state) => ({
            items: state.items.filter(
              (_, index) => index !== existingItemIndex
            ),
          }));
        }
      });
    });
  },

  // Eliminar items por inventario
  removeItemsByInventory: (inventoryId) => {
    set((state) => ({
      items: state.items.filter((item) => item.inventoryId !== inventoryId),
    }));
  },

  // Toggle allowPartialFulfillment para un producto específico
  toggleAllowPartialFulfillment: (inventoryId, productId) => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => {
        if (inventory.id === inventoryId) {
          return {
            ...inventory,
            products: inventory.products.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  allowPartialFulfillment: !product.allowPartialFulfillment,
                };
              }
              return product;
            }),
          };
        }
        return inventory;
      }),
    }));
  },

  // NUEVA FUNCIÓN: Resetear el store completamente
  resetStore: () => {
    set({
      inventories: [],
      items: [],
    });
  },

  // Obtener el total de productos seleccionados en un inventario específico
  getInventoryTotalSelected: (inventoryId) => {
    const { inventories } = get();
    const inventory = inventories.find((inv) => inv.id === inventoryId);
    if (!inventory) return 0;

    return inventory.products.reduce(
      (total, product) => total + product.count,
      0
    );
  },
}));

// Hook personalizado optimizado con solo las funciones necesarias
export const useWarehouseInventoryActions = () => {
  const store = useInventoryStore();

  return {
    // Estado
    inventories: store.inventories,
    items: store.items,

    // Acciones principales
    addNewInventory: store.addInventory,
    remove: store.removeInventory,
    updateProductCount: store.updateProductCount,
    selectAllProducts: store.selectAllProducts,
    resetInventory: store.resetInventory,
    addSelectedProductsToItems: store.addSelectedProductsToItems,
    removeItemsByInventory: store.removeItemsByInventory,
    toggleAllowPartialFulfillment: store.toggleAllowPartialFulfillment,
    resetStore: store.resetStore,

    // Getter
    getInventoryTotalSelected: store.getInventoryTotalSelected,

    // Helpers para incrementar/decrementar
    incrementProduct: (inventoryId: string, productId: string) => {
      const inventory = store.inventories.find((inv) => inv.id === inventoryId);
      if (inventory) {
        const product = inventory.products.find((p) => p.id === productId);
        if (product && product.count < product.stock) {
          store.updateProductCount(inventoryId, productId, product.count + 1);
        }
      }
    },

    decrementProduct: (inventoryId: string, productId: string) => {
      const inventory = store.inventories.find((inv) => inv.id === inventoryId);
      if (inventory) {
        const product = inventory.products.find((p) => p.id === productId);
        if (product && product.count > 0) {
          store.updateProductCount(inventoryId, productId, product.count - 1);
        }
      }
    },
  };
};
