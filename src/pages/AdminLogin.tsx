// File: src/pages/AdminLogin.tsx
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// const API_URL ='/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${API_URL}/admin/login`, {
        username,
        password
      });
      
      localStorage.setItem('adminToken', response.data.token);
      
      const redirectUrl = localStorage.getItem('adminRedirectUrl') || '/admin/dashboard';
      localStorage.removeItem('adminRedirectUrl');
      
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!recoveryEmail) {
      setError('Please enter your recovery email');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await axios.post(`${API_URL}/admin/reset-password`, {
        email: recoveryEmail
      });
      
      setSuccessMessage('Password reset instructions have been sent to your email');
      // Hide the form after successful submission
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage('');
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="admin-login">
      <div className="admin-container">
        <h1>{showForgotPassword ? 'Reset Password' : 'Admin Login'}</h1>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {!showForgotPassword ? (
          // Login Form
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="login-actions-container">
              <div className="primary-action">
                <button 
                  type="submit" 
                  className="btn btn-primary login-btn" 
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </button>
              </div>
              
              <div className="secondary-actions">
                <button 
                  type="button" 
                  className="btn btn-text forgot-password-btn"
                  onClick={toggleForgotPassword}
                >
                  Forgot Password?
                </button>
                
                <Link to="/" className="btn btn-outline back-btn">
                  <span className="icon">←</span> Back to Website
                </Link>
              </div>
            </div>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label htmlFor="recoveryEmail">Recovery Email</label>
              <input
                type="email"
                id="recoveryEmail"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="Enter your administrator email"
                required
              />
            </div>
            
            <div className="form-hint">
              <p>Enter the email associated with your admin account. We'll send you instructions to reset your password.</p>
            </div>
            
            <div className="login-actions-container">
              <div className="primary-action">
                <button 
                  type="submit" 
                  className="btn btn-primary login-btn" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              <div className="secondary-actions">
                <button 
                  type="button" 
                  className="btn btn-text back-to-login-btn"
                  onClick={toggleForgotPassword}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;