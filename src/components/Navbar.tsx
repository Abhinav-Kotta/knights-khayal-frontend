// src/components/Navbar.tsx
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#home" className="logo">
          <img src="/images/khayalpfp.png" alt="Knights Khayal Logo" className="logo-image" />
          <span className="logo-text">Knights Khayal</span>
        </a>
        
        <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
          <li><a href="#members" onClick={() => setMobileMenuOpen(false)}>Members</a></li>
          <li><a href="#performances" onClick={() => setMobileMenuOpen(false)}>Performances</a></li>
          <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          {/* <li className="admin-link">
            <Link 
              to={isAdminLoggedIn ? "/admin/dashboard" : "/admin/login"} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar