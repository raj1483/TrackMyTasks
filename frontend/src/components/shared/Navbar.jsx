import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Task Tracker
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/projects" className="hover:underline">
                Projects
              </Link>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;