import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <span className="text-lg font-semibold text-gray-700">
        Hola, {user?.username}!
      </span>

      <button
        onClick={handleLogout}
        className="
          flex items-center text-sm text-gray-500
          hover:text-red-600 hover:cursor-pointer transition
          p-2 rounded-xl active:bg-red-50/50
        "
      >
        <LogOut className="w-4 h-4 mr-1" />
        Cerrar Sesión
      </button>
    </div>
  );
}
