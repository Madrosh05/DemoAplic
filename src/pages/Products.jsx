import { useEffect } from 'react';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Navigate } from 'react-router-dom';

const Products = () => {
  const { user, loading: authLoading } = useAuthStore();
  const { products, loading: productsLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    const loadProducts = async () => {
      if (authLoading) {
        console.log('Esperando autenticación...');
        return;
      }

      if (!user) {
        console.log('No hay usuario autenticado');
        return;
      }

      console.log('Usuario autenticado, cargando productos...');
      try {
        await fetchProducts();
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    loadProducts();
  }, [user, authLoading, fetchProducts]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // Redireccionar si no hay usuario
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (productsLoading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            onClick={() => fetchProducts()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      )}

      <button
        onClick={() => fetchProducts()}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Recargar Productos
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
