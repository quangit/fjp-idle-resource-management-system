import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ResourceListPage from './pages/ResourceListPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import UpdateHistoryPage from './pages/UpdateHistoryPage';
import ReportsPage from './pages/ReportsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> }
    ]
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'resources', element: <ResourceListPage /> },
      { path: 'resources/:id', element: <ResourceDetailPage /> },
      { path: 'history', element: <UpdateHistoryPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
