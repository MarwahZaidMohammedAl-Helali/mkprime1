import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCareers } from '../services/dataService';

function Careers({ language, content }) {
  const t = content[language];
  
  // Load careers from Supabase
  const [careers, setCareers] = useState([]);
  
  useEffect(() => {
    const loadCareers = async () => {
      try {
        const careersData = await getCareers();
        setCareers(careersData);
      } catch (error) {
        console.error('Error loading careers:', error);
        setCareers([]);
      }
    };
    
    loadCareers();
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
