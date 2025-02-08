import { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import AddProductButton from '../components/AddProductButton';

const Products = () => {
  const { user, loading: authLoading } = useAuthStore();
  const { products, loading: productsLoading, error, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtener categorías únicas de los productos
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filtrar productos por categoría y término de búsqueda
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    <div className="container mx-auto px-4 py-8">
      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Selector de categorías */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>
        </div>
        
        <AddProductButton />
      </div>

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No se encontraron productos que coincidan con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};

export default Products;
