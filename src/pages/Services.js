import React from 'react';

function Services({ language, content }) {
  const t = content[language];

  return (
    <section id="services" className="services scroll-animate page-section">
      <div className="container">
        <h2>{t.services.title}</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" alt="Academic support" />
            </div>
            <h3>{t.services.service1.title}</h3>
            <p>{t.services.service1.desc}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" alt="Consulting" />
            </div>
            <h3>{t.services.service2.title}</h3>
            <p>{t.services.service2.desc}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80" alt="Technology" />
            </div>
            <h3>{t.services.service3.title}</h3>
            <p>{t.services.service3.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
