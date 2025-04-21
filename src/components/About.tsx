// src/components/About.tsx
const About = () => {
    return (
      <div className="about-section">
        <div className="about-decoration left"></div>
        <div className="about-decoration right"></div>
        
        <div className="section-header">
          <h2>About <span>Knights Khayal</span></h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <img src="/images/band-performance.jpg" alt="Knights Khayal performing" />
            <div className="image-frame"></div>
          </div>
          
          <div className="about-text">
            <h3>The Dreamweavers of Melody</h3>
            <p>
              Knights Khayal emerged from the vibrant cultural crossroads of Southeast Asia, 
              bringing together musicians passionate about celebrating the rich tapestry of 
              Indian classical and contemporary music.
            </p>
            <p>
              Our name reflects our artistic vision - "Knights" representing our dedication 
              and commitment to musical excellence, and "Khayal" (خیال) meaning imagination 
              or dreaminess in Urdu and Hindi, embodying the transcendent quality we bring to 
              our performances.
            </p>
            <p>
              Since our formation in 2015, we have been on a journey to create musical experiences 
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