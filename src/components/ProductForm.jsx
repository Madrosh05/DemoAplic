import { useState } from 'react';

const ProductForm = ({ initialData = {}, onSubmit, buttonText = 'Guardar' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    price: initialData.price || '',
    description: initialData.description || '',
    image: initialData.image || '',
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
          <span className="label-text">URL de la imagen</span>
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
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

      <button type="submit" className="btn btn-primary w-full">{buttonText}</button>
    </form>
  );
};

export default ProductForm;