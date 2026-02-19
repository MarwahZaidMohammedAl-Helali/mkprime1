import React from 'react';
import { Link } from 'react-router-dom';

function Careers({ language, content }) {
  const t = content[language];

  return (
    <section className="careers page-section scroll-animate">
      <div className="container">
        <h2>{t.careers.title}</h2>
        <p className="careers-intro">{t.careers.intro}</p>
        
        <div className="careers-grid">
          <div className="career-card">
            <h3>{t.careers.job1.title}</h3>
            <p className="job-type">{t.careers.job1.type}</p>
            <p>{t.careers.job1.description}</p>
            <Link to="/apply" className="apply-btn">{t.careers.apply}</Link>
          </div>
          
          <div className="career-card">
            <h3>{t.careers.job2.title}</h3>
            <p className="job-type">{t.careers.job2.type}</p>
            <p>{t.careers.job2.description}</p>
            <Link to="/apply" className="apply-btn">{t.careers.apply}</Link>
          </div>
          
          <div className="career-card">
            <h3>{t.careers.job3.title}</h3>
            <p className="job-type">{t.careers.job3.type}</p>
            <p>{t.careers.job3.description}</p>
            <Link to="/apply" className="apply-btn">{t.careers.apply}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Careers;
