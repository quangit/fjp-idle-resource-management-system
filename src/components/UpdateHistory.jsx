import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, History, FileText, Settings, 
  Bell, ChevronDown, LogOut, Menu, X, User as UserIcon,
  Shield, Search, Download, ChevronLeft, ChevronRight,
  Edit, Plus, Trash2, Upload, FileDown, RefreshCw, X as ClearIcon
} from 'lucide-react';
import './UpdateHistory.css';

function UpdateHistory({ user, onLogout, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Check permission
  const canAccess = ['Admin', 'RA', 'MNG'].includes(user?.role);
  
  // Filter states
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  
  // Table states
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock data
  const [allHistory] = useState([
    { id: 1, datetime: '2025-08-10 09:30', user: 'RA001', action: 'UPDATE', resource: 'Nguyen Van A', changes: 'Skills: Added React, Node.js' },
    { id: 2, datetime: '2025-08-10 09:15', user: 'MGR01', action: 'CREATE', resource: 'Tran Thi B', changes: 'New resource added to QA department' },
    { id: 3, datetime: '2025-08-10 08:45', user: 'RA001', action: 'DELETE', resource: 'Le Van C', changes: 'Resource removed from system' },
    { id: 4, datetime: '2025-08-09 16:30', user: 'ADMIN', action: 'UPDATE', resource: 'Hoang Thi D', changes: 'Rate: 500 → 550' },
    { id: 5, datetime: '2025-08-09 14:20', user: 'RA001', action: 'CV_UPLOAD', resource: 'Vo Van E', changes: 'New CV uploaded: cv_vo_van_e.pdf' },
    { id: 6, datetime: '2025-08-09 11:15', user: 'MGR02', action: 'UPDATE', resource: 'Pham Thi F', changes: 'Status: Available → Assigned' },
    { id: 7, datetime: '2025-08-09 10:00', user: 'RA002', action: 'BULK_UPDATE', resource: 'Multiple (5)', changes: 'Department changed to Engineering' },
    { id: 8, datetime: '2025-08-09 09:45', user: 'ADMIN', action: 'IMPORT', resource: 'Batch Import', changes: '10 resources imported successfully' },
    { id: 9, datetime: '2025-08-09 09:30', user: 'MGR01', action: 'EXPORT', resource: 'Export Report', changes: 'Exported 45 resources to Excel' },
    { id: 10, datetime: '2025-08-09 09:00', user: 'RA001', action: 'CV_DELETE', resource: 'Nguyen Van G', changes: 'Old CV deleted' },
    { id: 11, datetime: '2025-08-08 17:30', user: 'ADMIN', action: 'LOGIN', resource: 'System', changes: 'Admin logged in' },
    { id: 12, datetime: '2025-08-08 17:00', user: 'RA001', action: 'LOGOUT', resource: 'System', changes: 'RA001 logged out' },
    { id: 13, datetime: '2025-08-08 16:45', user: 'MGR02', action: 'UPDATE', resource: 'Le Thi I', changes: 'Skills: Added Python, Django' },
    { id: 14, datetime: '2025-08-08 16:30', user: 'RA002', action: 'CREATE', resource: 'Hoang Van J', changes: 'New resource added to Operations' },
    { id: 15, datetime: '2025-08-08 16:15', user: 'RA001', action: 'UPDATE', resource: 'Vo Thi K', changes: 'Rate: 390 → 420' },
  ]);

  const [usersList] = useState(['All Users', 'ADMIN', 'RA001', 'RA002', 'MGR01', 'MGR02']);

  const [notifications] = useState([
    { id: 1, text: '3 new resources added today', unread: true },
    { id: 2, text: 'Weekly report is ready', unread: true },
    { id: 3, text: 'System maintenance scheduled', unread: false }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      console.log('Auto refresh...');
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Redirect if no permission
  useEffect(() => {
    if (!canAccess) {
      alert('Access denied. Only Admin, RA, and MNG can access Update History.');
      onNavigate('dashboard');
    }
  }, [canAccess, onNavigate]);

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
    } else if (itemId === 'users') {
      onNavigate('users');
    } else {
      alert(`Navigate to ${itemId}`);
    }
  };

  // Filter and sort logic
  const getFilteredHistory = () => {
    let filtered = [...allHistory];

    // User filter
    if (userFilter && userFilter !== 'All Users') {
      filtered = filtered.filter(h => h.user === userFilter);
    }

    // Action filter
    if (actionFilter && actionFilter !== 'all') {
      filtered = filtered.filter(h => h.action === actionFilter);
    }

    // Resource search
    if (resourceSearch) {
      filtered = filtered.filter(h => 
        h.resource.toLowerCase().includes(resourceSearch.toLowerCase())
      );
    }

    // Date filters (simplified for demo)
    // In real app, would parse datetime and compare

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

  const filteredHistory = getFilteredHistory();
  const totalPages = Math.ceil(filteredHistory.length / pageSize);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate summary
  const todaySummary = {
    updates: allHistory.filter(h => h.action === 'UPDATE').length,
    creates: allHistory.filter(h => h.action === 'CREATE').length,
    deletes: allHistory.filter(h => h.action === 'DELETE').length,
    cvOps: allHistory.filter(h => h.action === 'CV_UPLOAD' || h.action === 'CV_DELETE').length
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setUserFilter('');
    setActionFilter('');
    setDateFrom('');
    setDateTo('');
    setResourceSearch('');
  };

  const handleExport = () => {
    alert('Export history functionality would be implemented here');
  };

  const handleSummaryReport = () => {
    alert('Generate summary report functionality would be implemented here');
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const getActionBadgeClass = (action) => {
    const classes = {
      'CREATE': 'action-create',
      'UPDATE': 'action-update',
      'DELETE': 'action-delete',
      'CV_UPLOAD': 'action-cv-upload',
      'CV_DELETE': 'action-cv-delete',
      'BULK_UPDATE': 'action-bulk',
      'IMPORT': 'action-import',
      'EXPORT': 'action-export',
      'LOGIN': 'action-login',
      'LOGOUT': 'action-logout'
    };
    return classes[action] || '';
  };

  const getActionIcon = (action) => {
    const icons = {
      'CREATE': Plus,
      'UPDATE': Edit,
      'DELETE': Trash2,
      'CV_UPLOAD': Upload,
      'CV_DELETE': FileDown,
      'BULK_UPDATE': RefreshCw,
      'IMPORT': Upload,
      'EXPORT': Download,
      'LOGIN': UserIcon,
      'LOGOUT': LogOut
    };
    return icons[action] || Edit;
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { id: 'resources', icon: Users, label: 'Idle Resources', active: false },
    { id: 'users', icon: UserIcon, label: 'User Management', active: false, adminOnly: true },
    { id: 'history', icon: History, label: 'Update History', active: true },
    { id: 'reports', icon: FileText, label: 'Reports', active: false },
    { id: 'settings', icon: Settings, label: 'Settings', active: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  if (!canAccess) {
    return null;
  }

  return (
    <div className="history-container">
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

        <main className="history-main">
          <div className="history-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <button onClick={() => onNavigate('dashboard')} className="breadcrumb-link">Dashboard</button>
              <span className="breadcrumb-separator">></span>
              <span className="breadcrumb-current">Update History</span>
            </div>

            {/* Page Title */}
            <div className="content-header">
              <h1 className="page-title">UPDATE HISTORY</h1>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
              <div className="filter-row">
                <div className="filter-group">
                  <label>User:</label>
                  <select
                    className="filter-select"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="">All Users</option>
                    {usersList.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Action:</label>
                  <select
                    className="filter-select"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  >
                    <option value="">All Actions</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="DELETE">Delete</option>
                    <option value="CV_UPLOAD">CV Upload</option>
                    <option value="CV_DELETE">CV Delete</option>
                    <option value="BULK_UPDATE">Bulk Update</option>
                    <option value="IMPORT">Import</option>
                    <option value="EXPORT">Export</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>From:</label>
                  <input
                    type="date"
                    className="filter-date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>To:</label>
                  <input
                    type="date"
                    className="filter-date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="search-row">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by resource name..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                  />
                </div>

                <button className="filter-btn primary">
                  <Search size={18} />
                  <span>Search</span>
                </button>

                <button className="filter-btn" onClick={handleClearFilters}>
                  <ClearIcon size={18} />
                  <span>Clear</span>
                </button>
              </div>

              <div className="action-row">
                <button className="action-btn" onClick={handleExport}>
                  <Download size={18} />
                  <span>Export History</span>
                </button>
                <button className="action-btn" onClick={handleSummaryReport}>
                  <FileText size={18} />
                  <span>Summary Report</span>
                </button>
              </div>
            </div>

            {/* History Table */}
            <div className="table-container">
              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th className="col-sortable" onClick={() => handleSort('datetime')}>
                        DateTime {sortColumn === 'datetime' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('user')}>
                        User {sortColumn === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('action')}>
                        Action {sortColumn === 'action' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('resource')}>
                        Resource {sortColumn === 'resource' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistory.map(record => {
                      const ActionIcon = getActionIcon(record.action);
                      return (
                        <tr key={record.id}>
                          <td className="col-datetime">{record.datetime}</td>
                          <td className="col-user">{record.user}</td>
                          <td>
                            <span className={`action-badge ${getActionBadgeClass(record.action)}`}>
                              <ActionIcon size={14} />
                              <span>{record.action}</span>
                            </span>
                          </td>
                          <td className="col-resource">{record.resource}</td>
                          <td className="col-changes">
                            <span className="changes-text">{record.changes}</span>
                            <button 
                              className="view-details-btn"
                              onClick={() => handleViewDetails(record)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredHistory.length)} of {filteredHistory.length} records
                </div>

                <div className="page-size-selector">
                  <span>Show:</span>
                  <select value={pageSize} onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Summary Section */}
              <div className="summary-section">
                <h3 className="summary-title">Summary Today:</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <Edit size={20} />
                    <span className="summary-value">{todaySummary.updates}</span>
                    <span className="summary-label">Updates</span>
                  </div>
                  <div className="summary-stat">
                    <Plus size={20} />
                    <span className="summary-value">{todaySummary.creates}</span>
                    <span className="summary-label">New Resources</span>
                  </div>
                  <div className="summary-stat">
                    <Trash2 size={20} />
                    <span className="summary-value">{todaySummary.deletes}</span>
                    <span className="summary-label">Deletions</span>
                  </div>
                  <div className="summary-stat">
                    <FileText size={20} />
                    <span className="summary-value">{todaySummary.cvOps}</span>
                    <span className="summary-label">CV Operations</span>
                  </div>
                </div>
              </div>

              {/* Action Types Legend */}
              <div className="legend-section">
                <h3 className="legend-title">Action Types:</h3>
                <div className="legend-items">
                  <span className="legend-item">CREATE</span>
                  <span className="legend-item">UPDATE</span>
                  <span className="legend-item">DELETE</span>
                  <span className="legend-item">CV_UPLOAD</span>
                  <span className="legend-item">CV_DELETE</span>
                  <span className="legend-item">BULK_UPDATE</span>
                  <span className="legend-item">IMPORT</span>
                  <span className="legend-item">EXPORT</span>
                  <span className="legend-item">LOGIN</span>
                  <span className="legend-item">LOGOUT</span>
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
            <span>Showing activities from last 30 days</span>
          </div>
          <div className="footer-sync">
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            <button 
              className="toggle-refresh-btn"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="footer-copyright">
            &copy; 2025 FJP. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Change Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Details</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>DateTime:</label>
                <span>{selectedRecord.datetime}</span>
              </div>
              <div className="detail-group">
                <label>User:</label>
                <span>{selectedRecord.user}</span>
              </div>
              <div className="detail-group">
                <label>Action:</label>
                <span className={`action-badge ${getActionBadgeClass(selectedRecord.action)}`}>
                  {selectedRecord.action}
                </span>
              </div>
              <div className="detail-group">
                <label>Resource:</label>
                <span>{selectedRecord.resource}</span>
              </div>
              <div className="detail-group full">
                <label>Changes:</label>
                <div className="changes-detail">
                  <p>{selectedRecord.changes}</p>
                  <div className="diff-view">
                    <div className="diff-column">
                      <h4>Before</h4>
                      <pre>Skills: Java, Spring</pre>
                    </div>
                    <div className="diff-column">
                      <h4>After</h4>
                      <pre>Skills: Java, Spring, React, Node.js</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateHistory;
