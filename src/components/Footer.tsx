// src/components/Footer.tsx
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="modern-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h3>Product</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#members">Members</a></li>
            <li><a href="#performances">Performances</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Resources</h3>
          <ul>
            <li><a href="#performances">Upcoming Shows</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#music">Music</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Connect</h3>
          <ul>
            <li><a href="mailto:contact@knightskhayal.com">Email Us</a></li>
            <li><a href="tel:+11234567890">+1 123 456 7890</a></li>
            <li><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Orlando, FL</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Social</h3>
          <ul>
            <li><a href="https://facebook.com/knightskhayal" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/knightskhayal/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://youtube.com/@KnightsKhayal" target="_blank" rel="noopener noreferrer">YouTube</a></li>
            <li><a href="https://spotify.com/artist/knightskhayal" target="_blank" rel="noopener noreferrer">Spotify</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom-row">
        <div className="footer-logo">
          <a href="#home" className="logo-wrapper">
            <img src="public/images/khayalpfp.png" alt="Knights Khayal Logo" className="footer-logo-img" />
            <h2>Knights Khayal</h2>
          </a>
        </div>
        <div className="footer-copyright">
          <p>© {currentYear} Knights Khayal. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;