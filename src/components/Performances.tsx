import { useState, useEffect } from 'react'
import axios from 'axios'

interface Performance {
  _id: string
  title: string
  date: string
  venue: string
  city: string
  image: string
  description: string
  ticketLink?: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const BASE_URL = window.location.origin;

const Performances = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming')
  const [upcomingPerformances, setUpcomingPerformances] = useState<Performance[]>([])
  const [previousPerformances, setPreviousPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/performances`)
        
        setUpcomingPerformances(Array.isArray(response.data?.upcoming) ? response.data.upcoming : [])
        setPreviousPerformances(Array.isArray(response.data?.previous) ? response.data.previous : [])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching performances:', err)
        setError('Failed to load performances')
        setLoading(false)
      }
    }
    
    fetchPerformances()
  }, [])
  
  const performances = activeTab === 'upcoming' 
  ? (Array.isArray(upcomingPerformances) ? upcomingPerformances : []) 
  : (Array.isArray(previousPerformances) ? previousPerformances : []);

  const getImageUrl = (imagePath: string) => {
    console.log('Performance image path:', imagePath);
    
    if (!imagePath) {
      return `${BASE_URL}/images/placeholder.jpg`;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${cleanPath}`;
  };

  return (
    <div className="performances-section">
      <div className="section-header">
        <h2>Our <span>Performances</span></h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="performances-tabs">
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Shows
        </button>
        <button 
          className={`tab-button ${activeTab === 'previous' ? 'active' : ''}`}
          onClick={() => setActiveTab('previous')}
        >
          Previous Performances
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading performances...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : Array.isArray(performances) && performances.length === 0 ? (
        <div className="no-performances">
          <p>No {activeTab === 'upcoming' ? 'upcoming' : 'previous'} performances at this time.</p>
        </div>
      ) : (
        <div className="performances-container">
          {performances.map(performance => (
            <div key={performance._id} className="performance-card">
              <div className="performance-image">
                <img 
                  src={getImageUrl(performance.image)} 
                  alt={performance.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${BASE_URL}/images/placeholder.jpg`;
                    console.log(`Error loading performance image: ${performance.image}, falling back to placeholder`);
                  }}
                />
                <div className="performance-date">
                  <span>{new Date(performance.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              
              <div className="performance-details">
                <h3>{performance.title}</h3>
                <p className="performance-venue">{performance.venue}</p>
                <p className="performance-city">{performance.city}</p>
                <p className="performance-description">{performance.description}</p>
                
                {performance.ticketLink && (
                  <a href={performance.ticketLink} className="btn btn-ticket" target="_blank" rel="noopener noreferrer">
                    Get Tickets
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Performances