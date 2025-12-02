import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, List, History, BarChart2, Settings, Briefcase } from 'lucide-react';
import useAuthStore from '../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'RA', 'Manager', 'Viewer'] },
  { to: '/dashboard/resources', icon: List, label: 'Idle Resources', roles: ['Admin', 'RA', 'Manager', 'Viewer'] },
  { to: '/dashboard/users', icon: Users, label: 'User Management', roles: ['Admin'] },
  { to: '/dashboard/history', icon: History, label: 'Update History', roles: ['Admin', 'RA', 'Manager'] },
  { to: '/dashboard/reports', icon: BarChart2, label: 'Reports', roles: ['Admin', 'RA', 'Manager'] },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings', roles: ['Admin', 'RA', 'Manager', 'Viewer'] },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const userRole = user?.role || 'Viewer';

  const availableNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-surface flex-shrink-0 border-r border-border flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-border">
        <Briefcase className="text-primary h-7 w-7" />
        <h1 className="text-xl font-bold ml-2">FJP-IRMS</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {availableNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'text-text-secondary hover:bg-border hover:text-text'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
