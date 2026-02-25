import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Careers({ language, content }) {
  const t = content[language];
  
  // Default careers constant - exactly 2 jobs
  const DEFAULT_CAREERS = [
    {
      id: 1,
      titleEn: 'Assignment Assistant (Remote)',
      titleAr: 'مساعد المهام (عن بُعد)',
      type: 'Part-time',
      typeAr: 'دوام جزئي',
      descEn: 'Assist students with assignments, projects, and coursework while ensuring academic quality and timely submission.',
      descAr: 'مساعدة الطلاب في المهام والمشاريع والدورات الدراسية مع ضمان الجودة الأكاديمية والتسليم في الوقت المحدد.'
    },
    {
      id: 2,
      titleEn: 'Student Coordinator (Remote)',
      titleAr: 'منسق الطلاب (عن بُعد)',
      type: 'Flexible Hours',
      typeAr: 'ساعات مرنة',
      descEn: 'Support students academically and socially while coordinating activities, managing data, and assisting with student engagement.',
      descAr: 'دعم الطلاب أكاديمياً واجتماعياً مع تنسيق الأنشطة وإدارة البيانات والمساعدة في مشاركة الطلاب.'
    }
  ];
  
  // Load careers from localStorage
  const [careers, setCareers] = useState([]);
  
  // Initialize default careers in localStorage
  const initializeDefaultCareers = () => {
    console.log('Initializing default careers in localStorage');
    try {
      localStorage.setItem('careers', JSON.stringify(DEFAULT_CAREERS));
      return DEFAULT_CAREERS;
    } catch (error) {
      console.error('Failed to save default careers to localStorage:', error);
      return DEFAULT_CAREERS;
    }
  };
  
  useEffect(() => {
    const loadCareers = () => {
      try {
        const saved = localStorage.getItem('careers');
        
        if (saved) {
          let parsedCareers;
          try {
            parsedCareers = JSON.parse(saved);
          } catch (parseError) {
            console.error('Failed to parse careers from localStorage:', parseError);
            const defaults = initializeDefaultCareers();
            setCareers(defaults);
            return;
          }
          
          if (!Array.isArray(parsedCareers)) {
            console.error('Careers data is not an array:', parsedCareers);
            const defaults = initializeDefaultCareers();
            setCareers(defaults);
            return;
          }
          
          if (parsedCareers.length === 0) {
            console.warn('No careers found, using defaults');
            const defaults = initializeDefaultCareers();
            setCareers(defaults);
            return;
          }
          
          setCareers(parsedCareers);
        } else {
          console.log('No careers in localStorage, initializing defaults');
          const defaults = initializeDefaultCareers();
          setCareers(defaults);
        }
      } catch (error) {
        console.error('Error loading careers:', error);
        setCareers(DEFAULT_CAREERS);
      }
    };
    
    loadCareers();
    
    // Listen for storage changes (when admin updates careers)
    const handleStorageChange = (e) => {
      if (e.key === 'careers') {
        console.log('Storage event received, reloading careers');
        loadCareers();
      }
    };
    
    // Listen for custom event from same window
    const handleCustomStorageChange = () => {
      console.log('Custom storage event received, reloading careers');
      loadCareers();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
  }, []);

  return (
    <section className="careers page-section scroll-animate">
      <div className="container">
        <h2>{t.careers.title}</h2>
        <p className="careers-intro">{t.careers.intro}</p>
        
        <div className="careers-grid">
          {careers.map((career) => (
            <div key={career.id} className="career-card">
              <h3>{language === 'ar' ? career.titleAr : career.titleEn}</h3>
              <p className="job-type">{language === 'ar' ? career.typeAr : career.type}</p>
              <p>{language === 'ar' ? career.descAr : career.descEn}</p>
              <Link 
                to="/apply" 
                state={{ jobPosition: language === 'ar' ? career.titleAr : career.titleEn }} 
                className="apply-btn"
              >
                {t.careers.apply}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Careers;
