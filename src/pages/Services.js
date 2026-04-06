function Services({ language, content }) {
  const t = content[language];
  
  // Use services data from content (already loaded in App.js)
  const services = content.services || [];

  return (
    <section id="services" className="services scroll-animate page-section">
      <div className="container">
        <h2>{t.services.title}</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <img 
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'} 
                  alt={language === 'ar' ? service.titleAr : service.titleEn} 
                />
              </div>
              <h3>{language === 'ar' ? service.titleAr : service.titleEn}</h3>
              <p>{language === 'ar' ? service.descAr : service.descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
