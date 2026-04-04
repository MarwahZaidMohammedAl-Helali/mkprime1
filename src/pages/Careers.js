import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToContent } from '../firebaseHelpers';

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
    // Set up Firebase real-time listener
    const unsubscribe = subscribeToContent('careers', (data) => {
      if (data && data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setCareers(data.jobs);
      } else {
        console.log('No careers in Firebase, using defaults');
        const defaults = initializeDefaultCareers();
        setCareers(defaults);
      }
    });

    // Cleanup listener on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initializeDefaultCareers]);

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
