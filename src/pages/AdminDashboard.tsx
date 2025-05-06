// File: src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL ='/api';

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

interface Performance {
  _id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  image: string;
  description: string;
  ticketLink?: string;
  active: boolean;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'performances'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'upcoming' | 'previous'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch members
        const membersResponse = await axios.get(`${API_URL}/admin/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMembers(membersResponse.data);

        // Fetch performances
        const performancesResponse = await axios.get(`${API_URL}/admin/performances`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPerformances(performancesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
        
        // Redirect to login if unauthorized
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Filter performances based on upcoming/previous and the current filter
  const filteredPerformances = performances.filter(performance => {
    if (performanceFilter === 'all') return true;
    
    const performanceDate = new Date(performance.date);
    const currentDate = new Date();
    const isUpcoming = performanceDate >= currentDate;
    
    if (performanceFilter === 'upcoming') return isUpcoming;
    if (performanceFilter === 'previous') return !isUpcoming;
    
    return true;
  });

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

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Manage Members
        </button>
        <button 
          className={`tab-button ${activeTab === 'performances' ? 'active' : ''}`}
          onClick={() => setActiveTab('performances')}
        >
          Manage Performances
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'members' ? (
          // Members Tab Content
          <>
            <div className="admin-actions">
              <h2>Band Members</h2>
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
          </>
        ) : (
          // Performances Tab Content
          <>
            <div className="admin-actions">
              <div className="admin-actions-left">
                <h2>Performances</h2>
                <div className="admin-filters">
                  <button 
                    className={`filter-button ${performanceFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setPerformanceFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-button ${performanceFilter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setPerformanceFilter('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button 
                    className={`filter-button ${performanceFilter === 'previous' ? 'active' : ''}`}
                    onClick={() => setPerformanceFilter('previous')}
                  >
                    Previous
                  </button>
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/performances/new')} 
                className="btn btn-primary"
              >
                Add New Performance
              </button>
            </div>

            <div className="performances-list">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerformances.map(performance => {
                    const performanceDate = new Date(performance.date);
                    const currentDate = new Date();
                    const isUpcoming = performanceDate >= currentDate;
                    
                    return (
                      <tr key={performance._id}>
                        <td>
                          <img 
                            src={performance.image.startsWith('http') ? performance.image : `${API_URL.replace('/api', '')}${performance.image}`} 
                            alt={performance.title} 
                            className="performance-thumbnail" 
                          />
                        </td>
                        <td>{performance.title}</td>
                        <td>{new Date(performance.date).toLocaleDateString()}</td>
                        <td>{performance.venue}</td>
                        <td>{performance.city}</td>
                        <td>
                          <span className={isUpcoming ? 'type-upcoming' : 'type-previous'}>
                            {isUpcoming ? 'Upcoming' : 'Previous'}
                          </span>
                        </td>
                        <td>
                          <span className={performance.active ? 'status-active' : 'status-inactive'}>
                            {performance.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => navigate(`/admin/performances/edit/${performance._id}`)}
                            className="btn btn-sm btn-edit"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;