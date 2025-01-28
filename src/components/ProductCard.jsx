import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';

const ProductCard = ({ product }) => {
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      await deleteProduct(product.id);
    }
  };

  return (
    <div className="card card-hover bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="image-container">
        <img src={product.image} alt={product.title} className="rounded-t-xl" />
      </div>
      <div className="card-body">
        <div className="badge badge-secondary mb-2">{product.category}</div>
        <h2 className="card-title text-lg font-bold line-clamp-2 mb-2">
          {product.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {product.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="card-actions justify-end gap-2">
          <Link 
            to={`/products/${product.id}`} 
            className="btn btn-primary btn-sm flex-1"
          >
            Ver detalles
          </Link>
          <Link 
            to={`/products/${product.id}/edit`} 
            className="btn btn-ghost btn-sm"
          >
            Editar
          </Link>
          <button 
            onClick={handleDelete} 
            className="btn btn-error btn-sm btn-square"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;