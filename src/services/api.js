import axios from 'axios';
import { getCurrentToken } from './firebase';

const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL); // Para verificar que la URL es correcta

const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
console.log('Base URL:', baseURL); // Para verificar la URL base final

// Crea instancia de axios con configuración común
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para agregar el token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getCurrentToken();
    console.log('Token obtenido:', token ? 'Sí' : 'No'); // Debug log
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No se encontró token de autenticación');
    }
    return config;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return Promise.reject(error);
  }
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      console.log('Error de autenticación, redirigiendo a login...');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

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
  }
};