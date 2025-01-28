import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useProductStore from '../store/productStore';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (productData) => {
    try {
      await updateProduct(id, productData);
      navigate(`/products/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-error">{error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          buttonText="Update Product"
        />
      </div>
    </div>
  );
};

export default EditProduct;