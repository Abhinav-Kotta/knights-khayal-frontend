// File: src/pages/AdminLogin.tsx
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Placeholder for forgot password feature
  const handleForgotPassword = () => {
    alert('Forgot password feature coming soon!');
  };

  return (
    <div className="admin-login">
      <div className="admin-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
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
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
              
              <Link to="/" className="btn btn-outline back-btn">
                <span className="icon">←</span> Back to Website
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;