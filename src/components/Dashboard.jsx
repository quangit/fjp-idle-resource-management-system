import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, History, FileText, Settings, 
  Bell, ChevronDown, LogOut, Menu, X, User as UserIcon,
  AlertTriangle, CheckCircle, UserCheck, Plus, Upload, 
  Clock, Shield, Activity, TrendingUp, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard({ user, onLogout, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalIdle: 45,
    urgent: 12,
    available: 23,
    assigned: 10
  });

  const [departmentData] = useState([
    { name: 'Engineering', count: 15 },
    { name: 'Sales', count: 8 },
    { name: 'Marketing', count: 6 },
    { name: 'HR', count: 5 },
    { name: 'Finance', count: 4 },
    { name: 'Operations', count: 7 }
  ]);

  const [activities] = useState([
    { id: 1, type: 'update', text: 'RA updated resource #123 status', time: '5 mins ago', icon: Activity },
    { id: 2, type: 'add', text: 'New resource added to Engineering dept', time: '15 mins ago', icon: Plus },
    { id: 3, type: 'download', text: '5 CVs downloaded by Manager', time: '1 hour ago', icon: TrendingUp },
    { id: 4, type: 'system', text: 'System backup completed successfully', time: '2 hours ago', icon: CheckCircle },
    { id: 5, type: 'alert', text: '3 resources reaching 2-month idle mark', time: '3 hours ago', icon: AlertTriangle }
  ]);

  const [notifications] = useState([
    { id: 1, text: '3 new resources added today', unread: true },
    { id: 2, text: 'Weekly report is ready', unread: true },
    { id: 3, text: 'System maintenance scheduled', unread: false }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleRefresh = () => {
    setStats(prev => ({
      ...prev,
      totalIdle: prev.totalIdle + Math.floor(Math.random() * 3) - 1
    }));
  };

  const handleMenuClick = (itemId) => {
    console.log('Menu clicked:', itemId); // Debug log
    if (itemId === 'resources') {
      onNavigate('resources');
    } else if (itemId === 'users') {
      onNavigate('users');
    } else if (itemId === 'history') {
      onNavigate('history');
    } else if (itemId === 'dashboard') {
      onNavigate('dashboard');
    } else {
      alert(`Navigate to ${itemId}`);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: true },
    { id: 'resources', icon: Users, label: 'Idle Resources', active: false },
    { id: 'users', icon: UserIcon, label: 'User Management', active: false, adminOnly: true },
    { id: 'history', icon: History, label: 'Update History', active: false },
    { id: 'reports', icon: FileText, label: 'Reports', active: false },
    { id: 'settings', icon: Settings, label: 'Settings', active: false }
  ];

  const quickActions = [
    { id: 'add', label: 'Add Resource', icon: Plus, color: 'primary', onClick: () => onNavigate('resources') },
    { id: 'import', label: 'Import', icon: Upload, color: 'secondary' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'accent' },
    { id: 'users', label: 'Manage Users', icon: UserIcon, color: 'purple', adminOnly: true, onClick: () => onNavigate('users') },
    { id: 'history', label: 'History', icon: Clock, color: 'blue', onClick: () => onNavigate('history') }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="header-logo">
            <Shield size={28} />
            <span className="header-title">FJP-IRMS</span>
          </div>
        </div>

        <div className="header-right">
          <button className="refresh-btn" onClick={handleRefresh} title="Refresh data">
            <RefreshCw size={20} />
          </button>

          <div className="notification-wrapper">
            <button 
              className="notification-btn" 
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {notificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button onClick={() => setNotificationOpen(false)}>×</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                      <div className="notification-dot"></div>
                      <span>{notif.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="user-menu-wrapper">
            <button 
              className="user-menu-btn" 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="user-avatar">
                <UserIcon size={18} />
              </div>
              <span className="user-name">{user?.fullName || user?.username}</span>
              <ChevronDown size={16} />
            </button>

            {userDropdownOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <div className="user-dropdown-name">{user?.fullName || user?.username}</div>
                    <div className="user-dropdown-role">{user?.role}</div>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item">
                  <UserIcon size={16} />
                  <span>Profile</span>
                </button>
                <button className="user-dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <div className="header-date">
            {formatDate(currentTime)}
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => {
              if (item.adminOnly && user?.role !== 'Admin') return null;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id} 
                  className={`nav-item ${item.active ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-content">
            <div className="content-header">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Welcome back, {user?.fullName || user?.username}!</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Idle</div>
                  <div className="stat-value">{stats.totalIdle}</div>
                </div>
                <div className="stat-trend">
                  <TrendingUp size={16} />
                  <span>+5%</span>
                </div>
              </div>

              <div className="stat-card stat-red">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Urgent (≥2mo)</div>
                  <div className="stat-value">{stats.urgent}</div>
                </div>
                <div className="stat-trend urgent">
                  <AlertTriangle size={16} />
                  <span>Action needed</span>
                </div>
              </div>

              <div className="stat-card stat-green">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Available Now</div>
                  <div className="stat-value">{stats.available}</div>
                </div>
                <div className="stat-trend positive">
                  <TrendingUp size={16} />
                  <span>Ready</span>
                </div>
              </div>

              <div className="stat-card stat-purple">
                <div className="stat-icon">
                  <UserCheck size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Assigned This Week</div>
                  <div className="stat-value">{stats.assigned}</div>
                </div>
                <div className="stat-trend positive">
                  <TrendingUp size={16} />
                  <span>+2 today</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card chart-card">
                <div className="card-header">
                  <h2 className="card-title">Idle by Department</h2>
                  <button className="card-action">View Details</button>
                </div>
                <div className="card-content">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#A3A3A3" 
                        tick={{ fill: '#A3A3A3' }}
                      />
                      <YAxis 
                        stroke="#A3A3A3" 
                        tick={{ fill: '#A3A3A3' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#262626', 
                          border: '1px solid #2F2F2F',
                          borderRadius: '8px',
                          color: '#FFFFFF'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="url(#colorGradient)" 
                        radius={[8, 8, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9E7FFF" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="dashboard-card activities-card">
                <div className="card-header">
                  <h2 className="card-title">Recent Activities</h2>
                  <button className="card-action">View All</button>
                </div>
                <div className="card-content">
                  <div className="activities-list">
                    {activities.map(activity => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="activity-item">
                          <div className={`activity-icon ${activity.type}`}>
                            <Icon size={16} />
                          </div>
                          <div className="activity-content">
                            <p className="activity-text">{activity.text}</p>
                            <span className="activity-time">{activity.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card quick-actions-card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              <div className="card-content">
                <div className="quick-actions-grid">
                  {quickActions.map(action => {
                    if (action.adminOnly && user?.role !== 'Admin') return null;
                    const Icon = action.icon;
                    return (
                      <button 
                        key={action.id} 
                        className={`quick-action-btn ${action.color}`}
                        onClick={action.onClick || (() => alert(`Action: ${action.label}`))}
                      >
                        <Icon size={20} />
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-status">
            <span className="status-indicator online"></span>
            <span>Status: Online</span>
          </div>
          <div className="footer-sync">
            Last sync: {formatTime(currentTime)}
          </div>
          <div className="footer-copyright">
            &copy; 2025 FJP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
