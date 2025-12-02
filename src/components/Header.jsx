import { Bell, User, LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-surface flex-shrink-0 border-b border-border flex items-center justify-between px-6">
      <div>
        {/* Breadcrumbs can go here */}
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Calendar className="h-4 w-4" />
          <span>{today}</span>
        </div>
        <button className="text-text-secondary hover:text-text transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-5 w-5 text-primary" />
          <span>{user?.name || 'User'}</span>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-sm text-text-secondary hover:text-error transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
