// src/components/Performances.tsx
import { useState } from 'react'

interface Performance {
  id: number
  title: string
  date: string
  venue: string
  city: string
  image: string
  description: string
  ticketLink?: string
}

const Performances = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming')
  
  const upcomingPerformances: Performance[] = [
    {
      id: 1,
      title: "Monsoon Melodies",
      date: "June 15, 2025",
      venue: "Cultural Center Auditorium",
      city: "Kuala Lumpur, Malaysia",
      image: "/images/performance-1.jpg",
      description: "A celebration of ragas associated with the monsoon season, creating a dreamlike atmosphere of renewal and rejuvenation.",
      ticketLink: "https://tickets.example.com/knights-khayal-monsoon"
    },
    {
      id: 2,
      title: "Echoes of the Silk Road",
      date: "July 22, 2025",
      venue: "Heritage Theatre",
      city: "Singapore",
      image: "/images/performance-2.jpg",
      description: "An imaginative journey through the musical traditions that traveled along the ancient Silk Road, connecting East and West.",
      ticketLink: "https://tickets.example.com/knights-khayal-silk-road"
    },
    {
      id: 3,
      title: "Midnight Raga",
      date: "August 10, 2025",
      venue: "Starlight Garden",
      city: "Bangkok, Thailand",
      image: "/images/performance-3.jpg",
      description: "An intimate open-air concert featuring night ragas under the stars, creating a truly magical experience.",
      ticketLink: "https://tickets.example.com/knights-khayal-midnight"
    }
  ]
  
  const previousPerformances: Performance[] = [
    {
      id: 4,
      title: "Fusion Festival",
      date: "March 5, 2025",
      venue: "World Music Arena",
      city: "Jakarta, Indonesia",
      image: "/images/performance-4.jpg",
      description: "A groundbreaking performance blending traditional ragas with contemporary Southeast Asian musical elements."
    },
    {
      id: 5,
      title: "Classical Reimagined",
      date: "December 12, 2024",
      venue: "National Concert Hall",
      city: "Manila, Philippines",
      image: "/images/performance-5.jpg",
      description: "A sold-out concert featuring innovative interpretations of classical compositions from the Indian subcontinent."
    },
    {
      id: 6,
      title: "Diwali Celebrations",
      date: "November 4, 2024",
      venue: "Community Center",
      city: "Penang, Malaysia",
      image: "/images/performance-6.jpg",
      description: "A special performance celebrating the festival of lights with joyous and uplifting compositions."
    }
  ]
  
  const performances = activeTab === 'upcoming' ? upcomingPerformances : previousPerformances

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
      
      <div className="performances-container">
        {performances.map(performance => (
          <div key={performance.id} className="performance-card">
            <div className="performance-image">
              <img src={performance.image} alt={performance.title} />
              <div className="performance-date">
                <span>{performance.date}</span>
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
    </div>
  )
}

export default Performances