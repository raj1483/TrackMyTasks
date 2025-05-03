import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi, getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await getMe(token);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await loginApi(email, password);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, country) => {
    try {
      const res = await registerApi(name, email, password, country);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;