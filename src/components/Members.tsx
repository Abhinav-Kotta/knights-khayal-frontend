// File: src/components/Members.tsx
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Member {
  _id: string
  name: string
  instrument: string
  bio: string
  image: string
  isCaptain: boolean
}

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_URL ='/api';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/members`);
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members. Please try again later.');
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="members-section">
        <div className="section-header">
          <h2>Our <span>Members</span></h2>
          <div className="section-divider"></div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="members-section">
        <div className="section-header">
          <h2>Our <span>Members</span></h2>
          <div className="section-divider"></div>
        </div>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // For testing
  const mockMembers: Member[] = members.length > 0 ? members : [
    {
      _id: "1",
      name: "John Doe",
      instrument: "Guitar",
      bio: "Lead guitarist with 10 years of experience",
      image: "/placeholder.jpg",
      isCaptain: true
    },
    {
      _id: "2",
      name: "Jane Smith",
      instrument: "Vocals",
      bio: "Lead vocalist with a passion for Hindustani classical",
      image: "/placeholder.jpg",
      isCaptain: false
    }
  ];

  const displayMembers = members && members.length > 0 ? members : mockMembers;

  return (
    <div className="members-section">
      <div className="section-header">
        <h2>Our <span>Members</span></h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="members-container">
        {displayMembers.map(member => (
          <div key={member._id} className={`member-card ${member.isCaptain ? 'captain' : ''}`}>
            <div className="member-image">
              <img 
                src={member.image && member.image.startsWith('http') 
                  ? member.image 
                  : member.image && !member.image.startsWith('/')
                    ? `/${member.image}`
                    : member.image || '/placeholder.jpg'}
                alt={member.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
              <div className="member-overlay">
                <p>{member.bio}</p>
              </div>
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="member-instrument">{member.instrument}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;