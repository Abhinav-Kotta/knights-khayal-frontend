// src/components/About.tsx
import { useState, useEffect } from 'react'

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Images for the slideshow
  const images = [
    "/images/perf_pic_1.jpeg",
    "/images/perf_pic_2.jpg",
    "/images/perf_pic_3.jpg",
    "/images/perf_pic_4.jpeg",
    "/images/perf_pic_5.jpeg",
    "/images/perf_pic_6.jpeg",
    "/images/perf_pic_7.jpeg",
    "/images/perf_pic_8.jpeg",
    "/images/perf_pic_9.jpeg",
    "/images/perf_pic_10.jpeg",
    "/images/perf_pic_11.jpeg",
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(current => (current + 1) % images.length)
    }, 7000)
    
    return () => clearInterval(interval)
  }, [images.length])
  

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }
  
  const nextSlide = () => {
    setCurrentSlide(current => (current + 1) % images.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide(current => (current === 0 ? images.length - 1 : current - 1))
  }
  
  return (
    <div className="about-section">
      <div className="about-decoration left"></div>
      <div className="about-decoration right"></div>
      
      <div className="section-header">
        <h2>About <span>Knights Khayal</span></h2>
        <div className="section-divider"></div>
      </div>
      
      <div className="about-content">
        <div className="about-image-slideshow">
          <div className="slideshow-container">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img src={image} alt={`Knights Khayal - ${index + 1}`} />
              </div>
            ))}
            
            <button className="slide-arrow prev" onClick={prevSlide}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button className="slide-arrow next" onClick={nextSlide}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <div className="slide-indicators">
            {images.map((_, index) => (
              <button 
                key={index} 
                className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
          
          <div className="image-frame"></div>
        </div>
        
        <div className="about-text">
          <h3>The Dreamweavers of Melody</h3>
          <p>
            Knights Khayal emerged from the vibrant cultural crossroads of South Asia, 
            bringing together musicians passionate about celebrating the rich tapestry of 
            Indian classical and contemporary music.
          </p>
          <p>
            Our name reflects our artistic vision - "Knights" representing the mascot of UCF, 
            and "Khayal" (خیال) meaning imagination 
            or dreaminess in Urdu and Hindi, embodying the transcendent quality we bring to 
            our performances.
          </p>
          <p>
            Since our formation in 2021, we have been on a journey to create musical experiences 
            that transport audiences to ethereal realms, blending traditional ragas with 
            contemporary elements that resonate with diverse audiences across cultural boundaries.
          </p>
          <p>
            Each performance is crafted as a dream-like experience, inviting listeners to 
            transcend the ordinary and explore the boundless landscapes of musical imagination.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About