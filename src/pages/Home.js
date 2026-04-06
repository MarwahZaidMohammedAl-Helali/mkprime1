import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home({ language, content }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = content[language];

  const heroImages = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80'
  ];

  // Use partners data from content (already loaded in App.js)
  const partners = (content.partners || []).slice(0, 5); // Show only first 5

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <>
      {/* Hero Section with Background Slider */}
      <section className="hero">
        {/* Background Image Slider */}
        <div className="hero-background-slider">
          <div className="slider-container">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="container">
          <div className="hero-content">
            <h1>{t.hero.title}</h1>
            <p>{t.hero.subtitle}</p>
            <Link to="/contact" className="cta-button">{t.hero.cta}</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about scroll-animate">
        <div className="container">
          <h2>{t.about.title}</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{t.about.description}</p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-icon">📅</span>
                  <span>{t.about.founded}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">👥</span>
                  <span>{t.about.team}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💼</span>
                  <span>{t.about.type}</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Team collaboration" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners scroll-animate" style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <h2>{t.partners.title}</h2>
          <p className="partners-intro">{t.partners.intro}</p>
          
          <div className="partners-grid">
            {partners.map((partner) => (
              <div key={partner.id} className="partner-card">
                <img 
                  src={`${process.env.PUBLIC_URL}/${partner.logoPath}`} 
                  alt={language === 'ar' ? partner.nameAr : partner.nameEn} 
                />
                <h3 className="partner-name">{language === 'ar' ? partner.nameAr : partner.nameEn}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
