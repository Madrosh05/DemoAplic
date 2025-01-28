import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useProductStore from '../store/productStore';

const AddProduct = () => {
  const navigate = useNavigate();
  const addProduct = useProductStore((state) => state.addProduct);

  const handleSubmit = async (productData) => {
    try {
      await addProduct(productData);
      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <ProductForm onSubmit={handleSubmit} buttonText="Add Product" />
      </div>
    </div>
  );
};

export default AddProduct;