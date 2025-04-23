// src/pages/ResetPassword.tsx
import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const { userId, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !token) {
      setTokenValid(false);
      setError('Invalid password reset link');
    }
  }, [userId, token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await axios.post(`${API_URL}/admin/reset-password/${userId}/${token}`, {
        password
      });
      
      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-container">
        <h1>Reset Your Password</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {success && (
          <div className="success-message">
            Password reset successful! You will be redirected to the login page in a moment.
          </div>
        )}
        
        {tokenValid && !success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="form-hint">
              <p>Password must be at least 8 characters long.</p>
            </div>
            
            <div className="login-actions-container">
              <div className="primary-action">
                <button 
                  type="submit" 
                  className="btn btn-primary login-btn" 
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
              
              <div className="secondary-actions">
                <Link to="/admin/login" className="btn btn-text back-to-login-btn">
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        )}
        
        {!tokenValid && (
          <div className="centered-actions">
            <Link to="/admin/login" className="btn btn-primary login-btn">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;