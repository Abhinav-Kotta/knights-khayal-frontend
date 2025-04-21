// File: src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface Member {
  _id: string;
  name: string;
  instrument: string;
  bio: string;
  image: string;
  isCaptain: boolean;
  order: number;
  active: boolean;
}

const AdminDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members');
        setLoading(false);
        // Redirect to login if unauthorized
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    };

    fetchMembers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-nav-actions">
          <Link to="/" className="btn btn-outline">
            <span className="icon">←</span> Back to Website
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="admin-actions">
          <h2>Manage Members</h2>
          <button 
            onClick={() => navigate('/admin/members/new')} 
            className="btn btn-primary"
          >
            Add New Member
          </button>
        </div>

        <div className="members-list">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Instrument</th>
                <th>Captain</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member._id}>
                  <td>
                    <img 
                      src={member.image.startsWith('http') ? member.image : `${API_URL.replace('/api', '')}${member.image}`} 
                      alt={member.name} 
                      className="member-thumbnail" 
                    />
                  </td>
                  <td>{member.name}</td>
                  <td>{member.instrument}</td>
                  <td>{member.isCaptain ? 'Yes' : 'No'}</td>
                  <td>{member.order}</td>
                  <td><span className={member.active ? 'status-active' : 'status-inactive'}>
                    {member.active ? 'Active' : 'Inactive'}
                  </span></td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/members/edit/${member._id}`)}
                      className="btn btn-sm btn-edit"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;