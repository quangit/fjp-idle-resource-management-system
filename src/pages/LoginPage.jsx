import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Briefcase } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('ra001');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username);
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-8 shadow-lg w-full max-w-sm animate-in fade-in-0 zoom-in-95">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text">ĐĂNG NHẬP</h2>
        <p className="text-text-secondary text-sm mt-1">Sử dụng tài khoản của bạn để tiếp tục</p>
        <p className="text-xs text-text-secondary mt-2">Hint: admin, ra001, mgr_hr, viewer01</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="remember-me" className="ml-2 text-text-secondary">Remember me</label>
          </div>
          <a href="#" className="font-medium text-primary hover:underline">Forgot password?</a>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary-focus transition-colors duration-300"
        >
          ĐĂNG NHẬP
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
