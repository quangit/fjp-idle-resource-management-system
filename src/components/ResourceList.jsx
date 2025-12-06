import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, History, FileText, Settings, 
  Bell, ChevronDown, LogOut, Menu, X, User as UserIcon,
  Shield, Search, Plus, Upload, Download, Trash2, 
  FileText as FileIcon, Edit2, Flame, ChevronLeft, 
  ChevronRight, Eye, Pin, Filter, X as ClearIcon
} from 'lucide-react';
import './ResourceList.css';

function ResourceList({ user, onLogout, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Table states
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Mock data
  const [allResources] = useState([
    { id: 1, name: 'Nguyen Van A', department: 'Engineering', skills: ['Java', 'Spring', 'MySQL'], idleFrom: '2025-06-01', rate: 500, urgent: true },
    { id: 2, name: 'Tran Thi B', department: 'QA', skills: ['Testing', 'Selenium', 'Automation'], idleFrom: '2025-07-15', rate: 400, urgent: false },
    { id: 3, name: 'Le Van C', department: 'BA', skills: ['Analysis', 'Documentation', 'Agile'], idleFrom: '2025-05-01', rate: 600, urgent: true },
    { id: 4, name: 'Hoang Thi D', department: 'Engineering', skills: ['.NET', 'C#', 'Azure'], idleFrom: '2025-07-20', rate: 550, urgent: false },
    { id: 5, name: 'Vo Van E', department: 'HR', skills: ['Recruitment', 'Training'], idleFrom: '2025-04-15', rate: 450, urgent: true },
    { id: 6, name: 'Pham Thi F', department: 'Sales', skills: ['B2B', 'Negotiation'], idleFrom: '2025-07-01', rate: 480, urgent: false },
    { id: 7, name: 'Nguyen Van G', department: 'Marketing', skills: ['SEO', 'Content', 'Social Media'], idleFrom: '2025-06-10', rate: 420, urgent: true },
    { id: 8, name: 'Tran Van H', department: 'Engineering', skills: ['React', 'Node.js', 'MongoDB'], idleFrom: '2025-07-25', rate: 580, urgent: false },
    { id: 9, name: 'Le Thi I', department: 'Finance', skills: ['Accounting', 'Excel', 'SAP'], idleFrom: '2025-05-20', rate: 520, urgent: true },
    { id: 10, name: 'Hoang Van J', department: 'Operations', skills: ['Logistics', 'Planning'], idleFrom: '2025-07-10', rate: 460, urgent: false },
    { id: 11, name: 'Vo Thi K', department: 'QA', skills: ['Manual Testing', 'API Testing'], idleFrom: '2025-06-15', rate: 390, urgent: true },
    { id: 12, name: 'Pham Van L', department: 'Engineering', skills: ['Python', 'Django', 'PostgreSQL'], idleFrom: '2025-07-28', rate: 570, urgent: false },
    { id: 13, name: 'Nguyen Thi M', department: 'BA', skills: ['Requirements', 'UML', 'JIRA'], idleFrom: '2025-05-10', rate: 590, urgent: true },
    { id: 14, name: 'Tran Van N', department: 'Sales', skills: ['B2C', 'CRM', 'Salesforce'], idleFrom: '2025-07-05', rate: 470, urgent: false },
    { id: 15, name: 'Le Van O', department: 'Marketing', skills: ['Digital Marketing', 'Analytics'], idleFrom: '2025-06-20', rate: 440, urgent: true },
  ]);

  const [departments] = useState([
    'Engineering', 'QA', 'BA', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'
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
    return new Date(date).toLocaleDateString('en-CA');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatIdleDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleMenuClick = (itemId) => {
    if (itemId === 'dashboard') {
      onNavigate('dashboard');
    } else {
      alert(`Navigate to ${itemId}`);
    }
  };

  // Filter and sort logic
  const getFilteredResources = () => {
    let filtered = [...allResources];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(r => r.department === departmentFilter);
    }

    // Status filter
    if (statusFilter) {
      if (statusFilter === 'Urgent') {
        filtered = filtered.filter(r => r.urgent);
      } else if (statusFilter === 'Available') {
        filtered = filtered.filter(r => !r.urgent);
      }
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        if (sortColumn === 'skills') {
          aVal = a.skills.join(',');
          bVal = b.skills.join(',');
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();
  const totalPages = Math.ceil(filteredResources.length / pageSize);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const urgentCount = filteredResources.filter(r => r.urgent).length;

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
      setSelectedRows(paginatedResources.map(r => r.id));
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert('Please select resources to delete');
      return;
    }
    if (window.confirm(`Delete ${selectedRows.length} selected resources?`)) {
      alert('Bulk delete functionality would be implemented here');
      setSelectedRows([]);
    }
  };

  const handleDownloadCV = (resourceId) => {
    alert(`Download CV for resource ${resourceId}`);
  };

  const handleEdit = (resourceId) => {
    alert(`Edit resource ${resourceId}`);
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleDownloadCVs = () => {
    if (selectedRows.length === 0) {
      alert('Please select resources to download CVs');
      return;
    }
    alert(`Download ${selectedRows.length} CVs as ZIP`);
  };

  const canEdit = ['Admin', 'RA', 'MNG'].includes(user?.role);
  const canDelete = ['Admin', 'RA'].includes(user?.role);
  const canSeeRate = ['Admin', 'RA', 'MNG'].includes(user?.role);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', active: false },
    { id: 'resources', icon: Users, label: 'Idle Resources', active: true },
    { id: 'users', icon: UserIcon, label: 'User Management', active: false, adminOnly: true },
    { id: 'history', icon: History, label: 'Update History', active: false },
    { id: 'reports', icon: FileText, label: 'Reports', active: false },
    { id: 'settings', icon: Settings, label: 'Settings', active: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="resource-list-container">
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

        <main className="resource-list-main">
          <div className="resource-list-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <button onClick={() => onNavigate('dashboard')} className="breadcrumb-link">Dashboard</button>
              <span className="breadcrumb-separator">></span>
              <span className="breadcrumb-current">Idle Resources</span>
            </div>

            {/* Page Title */}
            <div className="content-header">
              <h1 className="page-title">IDLE RESOURCE MANAGEMENT</h1>
            </div>

            {/* Search and Filter Bar */}
            <div className="filter-section">
              <div className="search-filter-bar">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="filter-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <button className="filter-btn primary" title="Search">
                  <Search size={18} />
                </button>

                <button className="filter-btn" onClick={handleClearFilters} title="Clear filters">
                  <ClearIcon size={18} />
                  <span>Clear</span>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="action-toolbar">
                {canEdit && (
                  <button className="action-btn primary">
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                )}
                {canEdit && (
                  <button className="action-btn">
                    <Upload size={18} />
                    <span>Import</span>
                  </button>
                )}
                <button className="action-btn" onClick={handleExport}>
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <button className="action-btn" onClick={handleDownloadCVs}>
                  <FileIcon size={18} />
                  <span>Download CVs</span>
                </button>
                {canDelete && (
                  <button className="action-btn danger" onClick={handleBulkDelete}>
                    <Trash2 size={18} />
                    <span>Bulk Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resource Table */}
            <div className="table-container">
              <div className="table-wrapper">
                <table className="resource-table">
                  <thead>
                    <tr>
                      <th className="col-checkbox">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedRows.length === paginatedResources.length && paginatedResources.length > 0}
                        />
                      </th>
                      <th className="col-urgent" title="Urgent status (>=2 months idle)"></th>
                      <th className="col-sortable" onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('department')}>
                        Department {sortColumn === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('skills')}>
                        Skills {sortColumn === 'skills' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="col-sortable" onClick={() => handleSort('idleFrom')}>
                        Idle From {sortColumn === 'idleFrom' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      {canSeeRate && (
                        <th className="col-sortable" onClick={() => handleSort('rate')}>
                          Rate {sortColumn === 'rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                      )}
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedResources.map(resource => (
                      <tr key={resource.id} className={selectedRows.includes(resource.id) ? 'selected' : ''}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(resource.id)}
                            onChange={() => handleSelectRow(resource.id)}
                          />
                        </td>
                        <td className="col-urgent">
                          {resource.urgent && (
                            <Flame size={18} className="urgent-icon" title="Urgent (>=2 months idle)" />
                          )}
                        </td>
                        <td className="col-name">{resource.name}</td>
                        <td>{resource.department}</td>
                        <td className="col-skills">
                          <div className="skills-container">
                            {resource.skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </td>
                        <td>{formatIdleDate(resource.idleFrom)}</td>
                        {canSeeRate && (
                          <td className="col-rate">${resource.rate}</td>
                        )}
                        <td className="col-actions">
                          <div className="action-buttons">
                            <button 
                              className="action-icon-btn" 
                              onClick={() => handleDownloadCV(resource.id)}
                              title="View CV"
                            >
                              <FileIcon size={16} />
                            </button>
                            {canEdit && (
                              <button 
                                className="action-icon-btn" 
                                onClick={() => handleEdit(resource.id)}
                                title="Edit resource"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
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
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredResources.length)} of {filteredResources.length} resources
                </div>

                <div className="page-size-selector">
                  <span>Show:</span>
                  <select value={pageSize} onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Legend */}
              <div className="legend-section">
                <div className="legend-item">
                  <Flame size={16} className="legend-icon urgent" />
                  <span>= Urgent (≥2 months idle)</span>
                </div>
                {!canSeeRate && (
                  <div className="legend-item">
                    <span className="legend-text">***</span>
                    <span>= Hidden for Viewer role</span>
                  </div>
                )}
              </div>

              {/* Column Settings */}
              <div className="column-settings">
                <button className="settings-btn">
                  <Eye size={16} />
                  <span>Show/Hide Columns</span>
                </button>
                <button className="settings-btn">
                  <Pin size={16} />
                  <span>Pin Columns</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-status">
            <span className="status-indicator online"></span>
            <span>Status: {filteredResources.length} resources | {urgentCount} urgent</span>
          </div>
          <div className="footer-sync">
            Last updated: {formatDate(currentTime)}
          </div>
          <div className="footer-copyright">
            &copy; 2025 FJP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ResourceList;
