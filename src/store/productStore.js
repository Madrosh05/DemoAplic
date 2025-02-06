import { create } from 'zustand';
import { api } from '../services/api';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await api.getAllProducts();
      set({ 
        products, 
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error en fetchProducts:', error);
      set({ 
        loading: false, 
        error: error.message || 'Error al obtener productos',
        products: [] // Limpiar productos en caso de error
      });
    }
  },

  addProduct: async (product) => {
    set({ loading: true });
    try {
      const newProduct = await api.createProduct(product);
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true });
    try {
      const updatedProduct = await api.updateProduct(id, product);
      set((state) => ({
        products: state.products.map((p) => 
          p.id === id ? updatedProduct : p
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await api.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
        error: null
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearProducts: () => set({ products: [], error: null }),
}));

export default useProductStore;