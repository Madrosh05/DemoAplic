import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import useAuthStore from './store/authStore';
import { auth, setupTokenRefresh } from './services/firebase';
import AddProductButton from './components/AddProductButton';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Verificando autenticación...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const { checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } 
          />
          <Route path="/products/add" element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          } />
          <Route path="/products/:id/edit" element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/products" replace />} />
        </Routes>
        <AddProductButton />
      </div>
    </Router>
  );
}

export default App;
