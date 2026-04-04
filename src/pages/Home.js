import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

function Home({ language, content }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [partners, setPartners] = useState([]);
  const t = content[language];

  const heroImages = [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80'
  ];

  // Default 5 partners
  const DEFAULT_PARTNERS = useMemo(() => [
   { 
      id: 1,
      nameEn: 'MK Elite',
      nameAr: 'MK Elite',
      logoPath: 'partner 1.jpeg',
      order: 1
    },
    { 
      id: 2,
      nameEn: 'ALQAWASMI',
      nameAr: 'ALQAWASMI',
      logoPath: 'Partener 2.png',
      order: 2
    },
    { 
      id: 3,
      nameEn: 'Management & Science University',
      nameAr: 'Management & Science University',
      logoPath: 'parnter 3.jpeg',
      order: 3
    },
    { 
      id: 4,
      nameEn: 'UCSI University',
      nameAr: 'UCSI University',
      logoPath: 'parnter 4.jpeg',
      order: 4
    },
    { 
      id: 5,
      nameEn: 'Duy Tân University',
      nameAr: 'Duy Tân University',
      logoPath: 'partener 5.jpeg',
      order: 5
    },
  ], []);

  // Load partners from localStorage
  useEffect(() => {
    const loadPartners = () => {
      try {
        const partnersData = localStorage.getItem('partners');
        if (partnersData) {
          const parsed = JSON.parse(partnersData);
          if (parsed && parsed.partners && Array.isArray(parsed.partners) && parsed.partners.length > 0) {
            setPartners(parsed.partners.sort((a, b) => a.order - b.order).slice(0, 5));
          } else {
            setPartners(DEFAULT_PARTNERS);
          }
        } else {
          setPartners(DEFAULT_PARTNERS);
        }
      } catch (error) {
        console.error('Error loading partners:', error);
        setPartners(DEFAULT_PARTNERS);
      }
    };
    
    loadPartners();
    
    // Listen for storage events from admin panel
    const handleStorageChange = (e) => {
      if (e.key === 'partners') {
        loadPartners();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [DEFAULT_PARTNERS]);

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
