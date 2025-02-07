import axios from 'axios';
import { getCurrentToken } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getCurrentToken();
    console.log('Token disponible:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error en interceptor:', error);
    return Promise.reject(error);
  }
});

export const api = {
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get('/products');
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error.response?.data?.message || 'Error al obtener productos';
    }
  },

  getProduct: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post('/products', {
      name: productData.title,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      images: productData.image ? [productData.image] : []
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, {
      name: productData.title,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      images: productData.image ? [productData.image] : []
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    await axiosInstance.delete(`/products/${id}`);
  },

  uploadImage: async (imageBase64) => {
    try {
      const response = await axiosInstance.post('/upload', { imageBase64 });
      return response.data;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }
};

export default api;