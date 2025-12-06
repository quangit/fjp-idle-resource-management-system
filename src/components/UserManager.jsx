import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, History, FileText, Settings, 
  Bell, ChevronDown, LogOut, Menu, X, User as UserIcon,
  Shield, Search, Plus, Upload, Download, Trash2, 
  Edit2, Lock, Unlock, ChevronLeft, ChevronRight
} from 'lucide-react';
import './UserManager.css';

function UserManager({ user, onLogout, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Check admin permission
  const isAdmin = user?.role === 'Admin';
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  
  // Table states
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Mock data
  const [allUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@fjp.vn', role: 'Admin', status: 'Active' },
    { id: 2, username: 'ra001', email: 'ra001@fjp.vn', role: 'RA', status: 'Active' },
    { id: 3, username: 'ra002', email: 'ra002@fjp.vn', role: 'RA', status: 'Active' },
    { id: 4, username: 'mgr_hr', email: 'mgr.hr@fjp.vn', role: 'MNG', status: 'Active' },
    { id: 5, username: 'mgr_it', email: 'mgr.it@fjp.vn', role: 'MNG', status: 'Active' },
    { id: 6, username: 'mgr_sales', email: 'mgr.sales@fjp.vn', role: 'MNG', status: 'Active' },
    { id: 7, username: 'viewer01', email: 'viewer01@fjp.vn', role: 'Viewer', status: 'Inactive' },
    { id: 8, username: 'viewer02', email: 'viewer02@fjp.vn', role: 'Viewer', status: 'Active' },
    { id: 9, username: 'ra003', email: 'ra003@fjp.vn', role: 'RA', status: 'Active' },
    { id: 10, username: 'mgr_qa', email: 'mgr.qa@fjp.vn', role: 'MNG', status: 'Active' },
    { id: 11, username: 'viewer03', email: 'viewer03@fjp.vn', role: 'Viewer', status: 'Inactive' },
    { id: 12, username: 'ra004', email: 'ra004@fjp.vn', role: 'RA', status: 'Active' },
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

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      alert('Access denied. Only Admin can access User Management.');
      onNavigate('dashboard');
    }
  }, [isAdmin, onNavigate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleMenuClick = (itemId) => {
    if (itemId === 'dashboard') {
      onNavigate('dashboard');
    } else if (itemId === 'resources') {
      onNavigate('resources');
    } else if (itemId === 'history') {
      onNavigate('history');
    } else {
      alert(`Navigate to ${itemId}`);
    }
  };

  // Filter and sort logic
  const getFilteredUsers = () => {
    let filtered = [...allUsers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeCount = filteredUsers.filter(u => u.status === 'Active').length;
  const inactiveCount = filteredUsers.filter(u => u.status === 'Inactive').length;

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedUsers.map(u => u.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (userId) => {
    const userToEdit = allUsers.find(u => u.id === userId);
    setEditingUser(userToEdit);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId) => {
    setDeletingUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    alert(`Delete user ${deletingUserId}`);
    setShowDeleteModal(false);
    setDeletingUserId(null);
  };

  const handleToggleStatus = (userId) => {
    alert(`Toggle status for user ${userId}`);
  };

  const handleBulkActivate = () => {
    if (selectedRows.length === 0) {
      alert('Please select users to activate');
      return;
    }
    alert(`Activate ${selectedRows.length} users`);
  };

  const handleBulkDeactivate = () => {
    if (selectedRows.length === 0) {
      alert('Please select users to deactivate');
      return;
    }
    alert(`Deactivate ${selectedRows.length} users`);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert('Please select users to delete');
      return;
    }
    if (window.confirm(`Delete ${selectedRows.length} selected users?`)) {
      alert('Bulk delete functionality would be implemented here');
      setSelectedRows([]);
    }
  };

  const handleExport = () => {
    alert('Export users functionality would be implemented here');
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { id: 'resources', icon: Users, label: 'Idle Resources', active: false },
    { id: 'users', icon: UserIcon, label: 'User Management', active: true, adminOnly: true },
    { id: 'history', icon: History, label: 'Update History', active: false },
    { id: 'reports', icon: FileText, label: 'Reports', active: false },
    { id: 'settings', icon: Settings, label: 'Settings', active: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="user-manager-container">
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

        <main className="user-manager-main">
          <div className="user-manager-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <button onClick={() => onNavigate('dashboard')} className="breadcrumb-link">Dashboard</button>
              <span className="breadcrumb-separator">></span>
              <span className="breadcrumb-current">User Management</span>
            </div>

            {/* Page Title */}
            <div className="content-header">
              <h1 className="page-title">USER MANAGEMENT</h1>
            </div>

            {/* Toolbar */}
            <div className="toolbar-section">
              <div className="search-toolbar">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by username or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button className="toolbar-btn primary" title="Search">
                  <Search size={18} />
                </button>

                <button className="toolbar-btn primary" onClick={handleAddUser}>
                  <Plus size={18} />
                  <span>Add User</span>
                </button>

                <button className="toolbar-btn">
                  <Upload size={18} />
                  <span>Import</span>
                </button>

                <button className="toolbar-btn" onClick={handleExport}>
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* User Table */}
            <div className="table-container">
              <div className="table-wrapper">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th className="col-checkbox">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedRows.length === paginatedUsers.length && paginatedUsers.length > 0}
                        />
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('username')}>
                        Username {sortColumn === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('email')}>
                        Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('role')}>
                        Role {sortColumn === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('status')}>
                        Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map(userItem => (
                      <tr key={userItem.id} className={selectedRows.includes(userItem.id) ? 'selected' : ''}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(userItem.id)}
                            onChange={() => handleSelectRow(userItem.id)}
                          />
                        </td>
                        <td className="col-username">{userItem.username}</td>
                        <td>{userItem.email}</td>
                        <td>
                          <span className={`role-badge role-${userItem.role.toLowerCase()}`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${userItem.status.toLowerCase()}`}>
                            {userItem.status}
                          </span>
                        </td>
                        <td className="col-actions">
                          <div className="action-buttons">
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleEditUser(userItem.id)}
                              title="Edit user"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleDeleteUser(userItem.id)}
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleToggleStatus(userItem.id)}
                              title="Toggle status"
                            >
                              {userItem.status === 'Active' ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination-section">
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="pagination-info">
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
                </div>

                <div className="page-size-selector">
                  <span>Show:</span>
                  <select value={pageSize} onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="bulk-actions-section">
                <h3 className="bulk-actions-title">Bulk Actions:</h3>
                <div className="bulk-actions-buttons">
                  <button className="bulk-btn" onClick={handleSelectAll}>
                    Select All
                  </button>
                  <button className="bulk-btn success" onClick={handleBulkActivate}>
                    Activate Selected
                  </button>
                  <button className="bulk-btn warning" onClick={handleBulkDeactivate}>
                    Deactivate
                  </button>
                  <button className="bulk-btn danger" onClick={handleBulkDelete}>
                    Delete Selected
                  </button>
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
            <span>Status: {filteredUsers.length} users total, {activeCount} active, {inactiveCount} inactive</span>
          </div>
          <div className="footer-sync">
            Last updated: {formatDate(currentTime)}
          </div>
          <div className="footer-copyright">
            &copy; 2025 FJP. All rights reserved.
          </div>
        </div>
      </footer>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username *</label>
                <input type="text" className="form-input" placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" className="form-input" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" className="form-input" placeholder="Enter password" />
                <small>Required for new users</small>
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select className="form-select">
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="RA">RA</option>
                  <option value="MNG">MNG</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <select className="form-select">
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                </select>
                <small>Required for MNG role</small>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <input type="checkbox" defaultChecked />
                  <span>Active</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
              <button className="modal-btn primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="modal-btn danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;
