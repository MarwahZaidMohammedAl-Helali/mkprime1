import React, { useState, useEffect } from 'react';

function Services({ language, content }) {
  const t = content[language];
  
  // Load services from localStorage
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    const loadServices = () => {
      const saved = localStorage.getItem('services');
      if (saved) {
        setServices(JSON.parse(saved));
      } else {
        // Default services if none exist
        setServices([
          {
            id: 1,
            titleEn: 'Academic Support',
            titleAr: 'الدعم الأكاديمي',
            descEn: 'Comprehensive support to help students excel in their studies',
            descAr: 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم'
          },
          {
            id: 2,
            titleEn: 'Educational Consulting',
            titleAr: 'الاستشارات التعليمية',
            descEn: 'Expert guidance for academic planning and career development',
            descAr: 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي'
          },
          {
            id: 3,
            titleEn: 'Edu Technology Solutions',
            titleAr: 'حلول التكنولوجيا التعليمية',
            descEn: 'Innovative tech tools and resources for academic success',
            descAr: 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي'
          },
          {
            id: 4,
            titleEn: 'Quality Education Programs',
            titleAr: 'برامج تعليمية عالية الجودة',
            descEn: 'We offer programs with a high quality of education and a strong learning system',
            descAr: 'نقدم برامج ذات جودة تعليمية عالية ونظام تعلم قوي'
          }
        ]);
      }
    };
    
    loadServices();
    
    // Listen for storage changes (when admin updates services)
    const handleStorageChange = (e) => {
      if (e.key === 'services') {
        loadServices();
      }
    };
    
    // Also listen for custom event from same window
    const handleCustomStorageChange = () => {
      loadServices();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
  }, []);

  return (
    <section id="services" className="services scroll-animate page-section">
      <div className="container">
        <h2>{t.services.title}</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <img 
                  src={
                    index === 0 ? "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" :
                    index === 1 ? "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" :
                    index === 2 ? "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80" :
                    `${process.env.PUBLIC_URL}/quality-education.jpg`
                  } 
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
