import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const AddProductButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user || location.pathname === '/products/add' || location.pathname.includes('/products/') || location.pathname === '/login') {
    return null;
  }

  return (
    <div
      className="add-product-icon"
      onClick={() => navigate('/products/add')} 
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z" />
      </svg>
    </div>
  );
};

export default AddProductButton;
