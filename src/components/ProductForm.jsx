import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductForm = ({ initialData = {}, onSubmit, buttonText = 'Guardar' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.name || '',
    price: initialData.price || '',
    description: initialData.description || '',
    image: initialData.images?.[0] || '',
    category: initialData.category || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name); // Debug

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          console.log('Iniciando carga de imagen...'); // Debug
          const imageBase64 = reader.result;
          const response = await api.uploadImage(imageBase64);
          console.log('Respuesta de upload:', response); // Debug
          
          setFormData(prev => ({
            ...prev,
            image: response.imageUrl
          }));
        } catch (error) {
          console.error('Error detallado al subir imagen:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          // Mostrar error al usuario
          alert('Error al subir la imagen. Por favor, intenta de nuevo.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Título</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Precio</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="input input-bordered"
          required
          step="0.01"
          min="0"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Descripción</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered"
          required
          rows="4"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Imagen</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />
        {formData.image && (
          <img 
            src={formData.image} 
            alt="Preview" 
            className="mt-2 h-32 object-contain"
          />
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Categoría</span>
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary flex-1">
          {buttonText}
        </button>
        <button 
          type="button" 
          onClick={() => navigate('/products')} 
          className="btn btn-ghost flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;