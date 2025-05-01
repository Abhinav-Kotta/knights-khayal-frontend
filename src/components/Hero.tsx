// src/components/Hero.tsx
import { useEffect, useRef } from 'react'

const Hero = () => {

  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      
      const elements = heroRef.current.querySelectorAll('.parallax')
      elements.forEach((el) => {
        const element = el as HTMLElement
        const speed = parseFloat(element.getAttribute('data-speed') || '0')
        const xOffset = (x - 0.5) * speed
        const yOffset = (y - 0.5) * speed
        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="hero" ref={heroRef}>
      <div className="hero-background">
        <div className="mountains parallax" data-speed="-15"></div>
        <div className="mic"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title parallax" data-speed="-80">
          <img src="/images/logokhayal.png" alt="LogoImage" />
        </h1>
        <p className="hero-subtitle parallax" data-speed="2">
          Where South Asian tradition meets the imagination of Indian classical music at the University of Central Florida
        </p>
        <div className="hero-buttons">
          <a href="#performances" className="btn btn-primary parallax" data-speed="3">
            UPCOMING SHOWS
          </a>
          <a href="#about" className="btn btn-secondary parallax" data-speed="3">
            DISCOVER OUR STORY
          </a>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
        <p>Scroll to explore</p>
      </div>
    </div>
  )
}

export default Hero