import React, { useState, useEffect } from 'react';

function Services({ language, content }) {
  const t = content[language];
  
  // Default services constant
  const DEFAULT_SERVICES = [
    {
      id: 1,
      titleEn: 'Academic Support',
      titleAr: 'الدعم الأكاديمي',
      descEn: 'Comprehensive support to help students excel in their studies',
      descAr: 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'
    },
    {
      id: 2,
      titleEn: 'Educational Consulting',
      titleAr: 'الاستشارات التعليمية',
      descEn: 'Expert guidance for academic planning and career development',
      descAr: 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80'
    },
    {
      id: 3,
      titleEn: 'Edu Technology Solutions',
      titleAr: 'حلول التكنولوجيا التعليمية',
      descEn: 'Innovative tech tools and resources for academic success',
      descAr: 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي',
      imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80'
    },
    {
      id: 4,
      titleEn: 'Quality Education Programs',
      titleAr: 'برامج تعليمية عالية الجودة',
      descEn: 'We offer programs with a high quality of education and a strong learning system',
      descAr: 'نقدم برامج ذات جودة تعليمية عالية ونظام تعلم قوي',
      imageUrl: `${process.env.PUBLIC_URL}/quality-education.jpg`
    }
  ];
  
  // Load services from localStorage
  const [services, setServices] = useState([]);
  
  // Initialize default services in localStorage
  const initializeDefaultServices = () => {
    console.log('Initializing default services in localStorage');
    try {
      localStorage.setItem('services', JSON.stringify(DEFAULT_SERVICES));
      return DEFAULT_SERVICES;
    } catch (error) {
      console.error('Failed to save default services to localStorage:', error);
      return DEFAULT_SERVICES;
    }
  };
  
  useEffect(() => {
    const loadServices = () => {
      try {
        const saved = localStorage.getItem('services');
        
        if (saved) {
          let parsedServices;
          try {
            parsedServices = JSON.parse(saved);
          } catch (parseError) {
            console.error('Failed to parse services from localStorage:', parseError);
            const defaults = initializeDefaultServices();
            setServices(defaults);
            return;
          }
          
          if (!Array.isArray(parsedServices)) {
            console.error('Services data is not an array:', parsedServices);
            const defaults = initializeDefaultServices();
            setServices(defaults);
            return;
          }
          
          if (parsedServices.length === 0) {
            console.warn('No services found, using defaults');
            const defaults = initializeDefaultServices();
            setServices(defaults);
            return;
          }
          
          setServices(parsedServices);
        } else {
          console.log('No services in localStorage, initializing defaults');
          const defaults = initializeDefaultServices();
          setServices(defaults);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setServices(DEFAULT_SERVICES);
      }
    };
    
    loadServices();
    
    // Listen for storage changes (when admin updates services)
    const handleStorageChange = (e) => {
      if (e.key === 'services') {
        console.log('Storage event received, reloading services');
        loadServices();
      }
    };
    
    // Listen for custom event from same window
    const handleCustomStorageChange = () => {
      console.log('Custom storage event received, reloading services');
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
