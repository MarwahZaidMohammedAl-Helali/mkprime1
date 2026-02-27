import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getContent } from '../firebaseHelpers';

function Careers({ language, content }) {
  const t = content[language];
  
  // Default careers constant - exactly 1 job
  const DEFAULT_CAREERS = useMemo(() => [
    {
      id: 1,
      titleEn: 'Student Coordinator (Remote)',
      titleAr: 'منسق الطلاب (عن بُعد)',
      type: 'Flexible Hours',
      typeAr: 'ساعات مرنة',
      descEn: 'Support students academically and socially while coordinating activities, managing data, and assisting with student engagement.',
      descAr: 'دعم الطلاب أكاديمياً واجتماعياً مع تنسيق الأنشطة وإدارة البيانات والمساعدة في مشاركة الطلاب.'
    }
  ], []);
  
  // Load careers from Firebase
  const [careers, setCareers] = useState([]);
  
  // Initialize default careers in Firebase
  const initializeDefaultCareers = useCallback(() => {
    console.log('Using default careers');
    return DEFAULT_CAREERS;
  }, [DEFAULT_CAREERS]);
  
  useEffect(() => {
    const loadCareers = async () => {
      try {
        const careersData = await getContent('careers');
        
        if (careersData && careersData.jobs && Array.isArray(careersData.jobs) && careersData.jobs.length > 0) {
          setCareers(careersData.jobs);
        } else {
          console.log('No careers in Firebase, using defaults');
          const defaults = initializeDefaultCareers();
          setCareers(defaults);
        }
      } catch (error) {
        console.error('Error loading careers from Firebase:', error);
        setCareers(DEFAULT_CAREERS);
      }
    };
    
    loadCareers();
    
    // Reload every 5 seconds to get updates from admin panel
    const interval = setInterval(loadCareers, 5000);
    
    return () => clearInterval(interval);
  }, [DEFAULT_CAREERS, initializeDefaultCareers]);

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
