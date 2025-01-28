import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import useProductStore from '../store/productStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      await deleteProduct(id);
      navigate('/products');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Producto no encontrado</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="bg-base-100 rounded-box shadow-xl">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="flex items-center justify-center bg-white rounded-lg p-8">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-[400px] object-contain"
            />
          </div>
          
          <div className="flex flex-col">
            <div className="badge badge-secondary mb-4 self-start">
              {product.category}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            <div className="mt-auto space-x-4">
              <Link 
                to={`/products/${id}/edit`} 
                className="btn btn-primary"
              >
                Editar Producto
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn btn-error"
              >
                Eliminar Producto
              </button>
              <Link 
                to="/products" 
                className="btn btn-ghost"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;