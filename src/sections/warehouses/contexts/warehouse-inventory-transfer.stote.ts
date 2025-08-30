import { create } from "zustand";

// Tipos para TypeScript
interface ProductDetail {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  productName: string;
  details: ProductDetail[];
  images: string[];
  quantity: number;
  count: number;
}

export interface Inventory {
  parentProductName: string;
  supplierName: string;
  totalQuantity: number;
  products: Product[];
  price: number;
  id: number;
}

export interface RequestItem {
  productVariantId: number;
  inventoryId: number; // Agregado el inventoryId
  quantityRequested: number;
  unit: string;
}

interface InventoryStore {
  inventories: Inventory[];
  items: RequestItem[];

  // Acciones
  setInventories: (inventories: Inventory[]) => void;
  addInventory: (inventory: Inventory) => void;
  updateProductCount: (
    inventoryId: number,
    productId: number,
    count: number
  ) => void;
  selectAllProducts: (inventoryId?: number) => void;
  resetInventory: (inventoryId?: number) => void;
  removeInventory: (inventoryId: number) => void;

  // Acciones para items de solicitud
  addSelectedProductsToItems: () => void;
  clearAllSelections: () => void;
  selectAllAvailableProducts: () => void;
  removeItemsByInventory: (inventoryId: number) => void;
  clearItems: () => void;

  // Getters computados
  getTotalSelected: () => number;
  getInventoryTotalSelected: (inventoryId: number) => number;
  getInventoryMaxTotal: (inventoryId: number) => number;
  getSelectedInventories: () => Inventory[];
  getSelectedProducts: () => {
    inventory: Inventory;
    product: Product;
    selectedCount: number;
  }[];
  getAllInventories: () => Inventory[];
  getInventoriesWithSelectedProducts: () => {
    inventory: Inventory;
    selectedProducts: { product: Product; selectedCount: number }[];
    totalSelectedCount: number;
    totalSelectedValue: number;
  }[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventories: [],
  items: [],

  // Establecer inventarios iniciales
  setInventories: (inventories) => set({ inventories }),

  // Agregar un nuevo inventario
  addInventory: (inventory) => {
    set((state) => {
      // Asegurar que todos los productos tengan count inicializado en 0
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

  // Actualizar la cantidad seleccionada de un producto específico usando su ID
  updateProductCount: (inventoryId, productId, count) => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => {
        if (inventory.id === inventoryId) {
          const updatedProducts = inventory.products.map((product) => {
            if (product.id === productId) {
              // Asegurar que el count no exceda la quantity disponible y no sea negativo
              const newCount = Math.max(0, Math.min(count, product.quantity));
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

  // Seleccionar todas las cantidades disponibles (de un inventario específico o todos)
  selectAllProducts: (inventoryId) => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => {
        if (!inventoryId || inventory.id === inventoryId) {
          return {
            ...inventory,
            products: inventory.products.map((product) => ({
              ...product,
              count: product.quantity, // Seleccionar toda la cantidad disponible
            })),
          };
        }
        return inventory;
      }),
    }));
  },

  // Restablecer inventario (un inventario específico o todos) y eliminar items relacionados
  resetInventory: (inventoryId) => {
    set((state) => {
      const updatedInventories = state.inventories.map((inventory) => {
        if (!inventoryId || inventory.id === inventoryId) {
          return {
            ...inventory,
            products: inventory.products.map((product) => ({
              ...product,
              count: 0, // Restablecer a 0
            })),
          };
        }
        return inventory;
      });

      // Filtrar items según el inventoryId
      const updatedItems = inventoryId
        ? state.items.filter((item) => item.inventoryId !== inventoryId)
        : []; // Si no se especifica inventoryId, limpiar todos los items

      return {
        inventories: updatedInventories,
        items: updatedItems,
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

  // Agregar productos seleccionados al array de items
  addSelectedProductsToItems: () => {
    const { inventories, items } = get();

    inventories.forEach((inventory) => {
      inventory.products.forEach((product) => {
        if (product.count > 0) {
          const existingItemIndex = items.findIndex(
            (item) =>
              item.productVariantId === product.id &&
              item.inventoryId === inventory.id
          );

          if (existingItemIndex >= 0) {
            // Si el item ya existe, actualizar la cantidad
            set((state) => ({
              items: state.items.map((item, index) =>
                index === existingItemIndex
                  ? {
                      ...item,
                      quantityRequested: product.count,
                    }
                  : item
              ),
            }));
          } else {
            // Si el item no existe, agregarlo al array
            set((state) => ({
              items: [
                ...state.items,
                {
                  productVariantId: product.id,
                  inventoryId: inventory.id, // Agregado el inventoryId
                  quantityRequested: product.count,
                  unit: "UM",
                },
              ],
            }));
          }
        }
      });
    });
  },

  // Limpiar todas las selecciones de productos
  clearAllSelections: () => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => ({
        ...inventory,
        products: inventory.products.map((product) => ({
          ...product,
          count: 0,
        })),
      })),
    }));
  },

  // Seleccionar todos los productos disponibles
  selectAllAvailableProducts: () => {
    set((state) => ({
      inventories: state.inventories.map((inventory) => ({
        ...inventory,
        products: inventory.products.map((product) => ({
          ...product,
          count: product.quantity,
        })),
      })),
    }));
  },

  // Limpiar el array de items
  clearItems: () => {
    set({ items: [] });
  },

  // Obtener el total de productos seleccionados en todos los inventarios
  getTotalSelected: () => {
    const { inventories } = get();
    return inventories.reduce((total, inventory) => {
      return (
        total +
        inventory.products.reduce((invTotal, product) => {
          return invTotal + product.count;
        }, 0)
      );
    }, 0);
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

  // Obtener el total máximo de productos disponibles en un inventario
  getInventoryMaxTotal: (inventoryId) => {
    const { inventories } = get();
    const inventory = inventories.find((inv) => inv.id === inventoryId);
    if (!inventory) return 0;

    return inventory.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  },

  // Obtener inventarios que tienen productos seleccionados
  getSelectedInventories: () => {
    const { inventories } = get();
    return inventories.filter((inventory) => {
      return inventory.products.some((product) => product.count > 0);
    });
  },

  // Obtener lista detallada de productos seleccionados con su inventario
  getSelectedProducts: () => {
    const { inventories } = get();
    const selectedProducts: {
      inventory: Inventory;
      product: Product;
      selectedCount: number;
    }[] = [];

    inventories.forEach((inventory) => {
      inventory.products.forEach((product) => {
        if (product.count > 0) {
          selectedProducts.push({
            inventory,
            product,
            selectedCount: product.count,
          });
        }
      });
    });

    return selectedProducts;
  },

  // Obtener todos los inventarios
  getAllInventories: () => {
    const { inventories } = get();
    return inventories;
  },

  // Obtener inventarios con sus productos seleccionados y cantidades
  getInventoriesWithSelectedProducts: () => {
    const { inventories } = get();

    return inventories
      .filter((inventory) => {
        // Solo incluir inventarios que tienen productos seleccionados
        return inventory.products.some((product) => product.count > 0);
      })
      .map((inventory) => {
        const selectedProducts = inventory.products
          .filter((product) => product.count > 0)
          .map((product) => ({
            product,
            selectedCount: product.count,
          }));

        const totalSelectedCount = selectedProducts.reduce(
          (total, item) => total + item.selectedCount,
          0
        );

        const totalSelectedValue = totalSelectedCount * inventory.price;

        return {
          inventory,
          selectedProducts,
          totalSelectedCount,
          totalSelectedValue,
        };
      });
  },

  removeItemsByInventory: (inventoryId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.inventoryId !== inventoryId),
    }));
  },
}));

// Hook personalizado para operaciones específicas de inventario
export const useWarehouseInventoryActions = () => {
  const store = useInventoryStore();

  return {
    // Funciones del store
    inventories: store.inventories,
    items: store.items,
    remove: store.removeInventory,
    selectAllProducts: store.selectAllProducts,
    resetInventory: store.resetInventory,
    updateProductCount: store.updateProductCount,
    addInventory: store.addInventory,
    setInventories: store.setInventories,
    addSelectedProductsToItems: store.addSelectedProductsToItems,
    clearAllSelections: store.clearAllSelections,
    selectAllAvailableProducts: store.selectAllAvailableProducts,
    clearItems: store.clearItems,

    // Getters
    getTotalSelected: store.getTotalSelected,
    getInventoryTotalSelected: store.getInventoryTotalSelected,
    getInventoryMaxTotal: store.getInventoryMaxTotal,
    getSelectedInventories: store.getSelectedInventories,
    getSelectedProducts: store.getSelectedProducts,
    getInventoriesWithSelectedProducts:
      store.getInventoriesWithSelectedProducts,

    // Incrementar producto usando productId
    incrementProduct: (inventoryId: number, productId: number) => {
      const inventory = store.inventories.find((inv) => inv.id === inventoryId);
      if (inventory) {
        const product = inventory.products.find((p) => p.id === productId);
        if (product && product.count < product.quantity) {
          store.updateProductCount(inventoryId, productId, product.count + 1);
        }
      }
    },

    // Decrementar producto usando productId
    decrementProduct: (inventoryId: number, productId: number) => {
      const inventory = store.inventories.find((inv) => inv.id === inventoryId);
      if (inventory) {
        const product = inventory.products.find((p) => p.id === productId);
        if (product && product.count > 0) {
          store.updateProductCount(inventoryId, productId, product.count - 1);
        }
      }
    },

    // Verificar si un inventario está completamente seleccionado
    isInventoryFullySelected: (inventoryId: number) => {
      const selected = store.getInventoryTotalSelected(inventoryId);
      const max = store.getInventoryMaxTotal(inventoryId);
      return selected === max && max > 0;
    },

    // Verificar si un inventario está vacío (sin selecciones)
    isInventoryEmpty: (inventoryId: number) => {
      return store.getInventoryTotalSelected(inventoryId) === 0;
    },

    // Obtener progreso de selección de un inventario (0-100)
    getInventoryProgress: (inventoryId: number) => {
      const selected = store.getInventoryTotalSelected(inventoryId);
      const max = store.getInventoryMaxTotal(inventoryId);
      return max > 0 ? (selected / max) * 100 : 0;
    },

    // Agregar un nuevo inventario con helper method
    addNewInventory: (inventoryData: Inventory) => {
      store.addInventory(inventoryData);
    },

    // Helper para obtener el count total de items en el array
    getTotalItemsRequested: () => {
      return store.items.reduce(
        (total, item) => total + item.quantityRequested,
        0
      );
    },

    // Helper para obtener un producto específico
    getProduct: (inventoryId: number, productId: number) => {
      const inventory = store.inventories.find((inv) => inv.id === inventoryId);
      return inventory?.products.find((p) => p.id === productId);
    },

    // Helper para verificar si un producto específico está seleccionado
    isProductSelected: (inventoryId: number, productId: number) => {
      const product = store.inventories
        .find((inv) => inv.id === inventoryId)
        ?.products.find((p) => p.id === productId);
      return product ? product.count > 0 : false;
    },

    // Helper para obtener el count de un producto específico
    getProductCount: (inventoryId: number, productId: number) => {
      const product = store.inventories
        .find((inv) => inv.id === inventoryId)
        ?.products.find((p) => p.id === productId);
      return product ? product.count : 0;
    },

    // Nuevo helper para obtener items de un inventario específico
    getItemsByInventory: (inventoryId: number) => {
      return store.items.filter((item) => item.inventoryId === inventoryId);
    },

    removeItemsByInventory: (inventoryId: number) =>
      store.removeItemsByInventory(inventoryId),
  };
};
