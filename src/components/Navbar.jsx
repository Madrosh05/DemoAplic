import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { logOut } from '../services/firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logOut();
      clearUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar glass-effect sticky top-0 z-50 px-4 lg:px-8">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          <span className="text-primary font-bold">HSE</span>
          <span className="text-gray-600">Demo</span>
        </Link>
      </div>
      <div className="flex-none gap-4">
        {user && (
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-2">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL} alt="profile" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span className="text-sm opacity-50">Hola, {user.displayName}</span>
                </li>
                <li>
                  <Link to="/products" className="justify-between">
                    Products
                    <span className="badge badge-primary badge-sm">New</span>
                  </Link>
                </li>
                <li className="divider"></li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;