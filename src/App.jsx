import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ResourceList from './components/ResourceList';
import UserManager from './components/UserManager';
import UpdateHistory from './components/UpdateHistory';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentScreen('login');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  };

  const handleNavigate = (screen) => {
    console.log('Navigating to:', screen); // Debug log
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'resources':
        return <ResourceList user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'users':
        return <UserManager user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'history':
        return <UpdateHistory user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
      default:
        return <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
