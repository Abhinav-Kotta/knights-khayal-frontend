// src/components/Footer.tsx
const Footer = () => {
    const currentYear = new Date().getFullYear()
    
    return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Knights Khayal</h2>
            <p>Where dreams and melodies intertwine</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#members">Members</a></li>
                <li><a href="#performances">Performances</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Legal</h3>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Join Our Newsletter</h3>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button className="btn-subscribe">Subscribe</button>
              </div>
              <p className="newsletter-info">
                Stay updated with our latest performances and musical journeys
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {currentYear} Knights Khayal. All rights reserved.</p>
        </div>
      </footer>
    )
  }
  
  export default Footer