import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4 text-center">
        <p>Task Tracker © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;