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
          {t.careers.jobs && t.careers.jobs.length > 0 ? (
            t.careers.jobs.map((job, index) => (
              <div key={index} className="career-card">
                <h3>{job.title}</h3>
                <p className="job-type">{job.type}</p>
                <p>{job.description}</p>
                <Link to="/apply" state={{ jobPosition: job.title }} className="apply-btn">{t.careers.apply}</Link>
              </div>
            ))
          ) : (
            <>
              <div className="career-card">
                <h3>{t.careers.job1?.title || 'Position Available'}</h3>
                <p className="job-type">{t.careers.job1?.type || 'Full-time'}</p>
                <p>{t.careers.job1?.description || 'Job description'}</p>
                <Link to="/apply" state={{ jobPosition: t.careers.job1?.title || 'Position Available' }} className="apply-btn">{t.careers.apply}</Link>
              </div>
              
              <div className="career-card">
                <h3>{t.careers.job2?.title || 'Position Available'}</h3>
                <p className="job-type">{t.careers.job2?.type || 'Full-time'}</p>
                <p>{t.careers.job2?.description || 'Job description'}</p>
                <Link to="/apply" state={{ jobPosition: t.careers.job2?.title || 'Position Available' }} className="apply-btn">{t.careers.apply}</Link>
              </div>
              
              <div className="career-card">
                <h3>{t.careers.job3?.title || 'Position Available'}</h3>
                <p className="job-type">{t.careers.job3?.type || 'Part-time'}</p>
                <p>{t.careers.job3?.description || 'Job description'}</p>
                <Link to="/apply" state={{ jobPosition: t.careers.job3?.title || 'Position Available' }} className="apply-btn">{t.careers.apply}</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Careers;
