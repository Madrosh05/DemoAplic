import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, getCurrentToken } from '../services/firebase';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      
      if (!userCredential.email?.endsWith('@horusautomation.com')) {
        alert('Solo se permiten correos de @horusautomation.com');
        return;
      }

      console.log('Login exitoso, guardando usuario...'); 
      setUser(userCredential);
      
      // Verifica que el token esté disponible
      const token = await getCurrentToken();
      console.log('Token disponible:', !!token); 

      navigate('/products');
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
        <button
          onClick={handleGoogleLogin}
          className="btn btn-primary"
        >
          Iniciar sesión con Google
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Solo se permiten correos de @horusautomation.com
        </p>
      </div>
    </div>
  );
};

export default Login;