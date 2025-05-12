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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const BASE_URL = window.location.origin;
const BACKEND_URL = 'https://kkhayal.com';

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/members`);
        console.log("Members API response:", response.data);
        setMembers(Array.isArray(response.data) ? response.data : []);
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

  const mockMembers: Member[] = [
    {
      _id: "1",
      name: "John Doe",
      instrument: "Guitar",
      bio: "Lead guitarist with 10 years of experience",
      image: "/images/placeholder.jpg",
      isCaptain: true
    },
    {
      _id: "2",
      name: "Jane Smith",
      instrument: "Vocals",
      bio: "Lead vocalist with a passion for Hindustani classical",
      image: "/images/placeholder.jpg",
      isCaptain: false
    }
  ];

  const displayMembers = Array.isArray(members) && members.length > 0 
    ? members 
    : mockMembers;

  const getImageUrl = (imagePath: string) => {
    console.log('Original image path:', imagePath);
    
    if (!imagePath) {
      return `${BASE_URL}/images/placeholder.jpg`;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      // For uploads, use the proxy through our own server
      // This enables our proxy server to handle it
      return `${BASE_URL}${imagePath}`;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${cleanPath}`;
  };

  return (
    <div className="members-section">
      <div className="section-header">
        <h2>Our <span>Members</span></h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="members-container">
        {Array.isArray(displayMembers) ? (
          displayMembers.map(member => {
            console.log(`Member image path: ${member.image}`);
            console.log(`Converted URL: ${getImageUrl(member.image)}`);
            
            return (
              <div key={member._id} className={`member-card ${member.isCaptain ? 'captain' : ''}`}>
                <div className="member-image">
                  <img 
                    src={getImageUrl(member.image)}
                    alt={member.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.log(`Image load error for: ${member.image}`);
                      target.src = `${BASE_URL}/images/placeholder.jpg`;
                      console.log(`Falling back to placeholder`);
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
            );
          })
        ) : (
          <p>No members to display</p>
        )}
      </div>
    </div>
  );
};

export default Members;