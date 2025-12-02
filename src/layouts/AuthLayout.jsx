import { Outlet } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-6 text-center">
        <h1 className="text-2xl font-bold text-text tracking-wider">FJP - IRMS</h1>
        <p className="text-text-secondary">Hệ thống Quản lý Idle Resource</p>
      </header>
      
      <main className="w-full max-w-md">
        <Outlet />
      </main>

      <footer className="absolute bottom-0 w-full p-6 text-center text-text-secondary text-sm">
        © {new Date().getFullYear()} FJP. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
