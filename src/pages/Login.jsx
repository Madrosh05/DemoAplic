import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../services/firebase';
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
      const user = await signInWithGoogle();
      setUser(user);
      navigate('/products');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold mb-4">Bienvenido a HSE Demo</h2>
          <button
            onClick={handleGoogleLogin}
            className="btn btn-primary"
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;