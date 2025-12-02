import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-background text-text">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
        <footer className="bg-surface border-t border-border px-6 py-2 text-xs text-text-secondary">
          Status: Online | Last sync: {new Date().toLocaleTimeString()}
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
