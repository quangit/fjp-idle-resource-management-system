import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, User, Shield, AlertCircle } from 'lucide-react';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const newErrors = {};

    if (touched.username) {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }

    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setLoginError('');
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ username: true, password: true });

    const validationErrors = {};
    if (!formData.username || formData.username.length < 3) {
      validationErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password || formData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Simulate user data
      const userData = {
        username: formData.username,
        role: 'Admin',
        fullName: 'John Doe'
      };

      onLogin(userData);
      
    } catch (error) {
      setLoginError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.username.length >= 3 && 
                      formData.password.length >= 8 && 
                      Object.keys(errors).length === 0;

  return (
    <div className="login-container">
      <div className="background-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <header className="login-header">
        <div className="header-content">
          <div className="system-badge">
            <Shield className="shield-icon" size={24} />
            <span>Secure System</span>
          </div>
          <h1 className="system-title">FJP - IRMS</h1>
          <p className="system-subtitle">Idle Resource Management System</p>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-container">
              <div className="logo-circle">
                <Shield size={48} strokeWidth={1.5} />
              </div>
              <div className="logo-glow"></div>
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to access your dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {loginError && (
              <div className="error-banner">
                <AlertCircle size={20} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className={`input-wrapper ${errors.username ? 'error' : ''} ${touched.username && !errors.username && formData.username ? 'success' : ''}`}>
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''} ${touched.password && !errors.password && formData.password ? 'success' : ''}`}>
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Remember me</span>
              </label>
            </div>

            <button type="submit" className="login-button" disabled={!isFormValid || isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <Shield size={20} />
                </>
              )}
            </button>

            <div className="form-footer">
              <a href="#" className="forgot-link" onClick={(e) => {
                e.preventDefault();
                alert('Password reset functionality would be implemented here');
              }}>
                Forgot password?
              </a>
            </div>
          </form>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <Shield size={24} />
            <h3>Secure Access</h3>
            <p>Enterprise-grade security for your data</p>
          </div>
          <div className="info-card">
            <Lock size={24} />
            <h3>Encrypted</h3>
            <p>All communications are encrypted</p>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <p>&copy; 2025 FJP. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
