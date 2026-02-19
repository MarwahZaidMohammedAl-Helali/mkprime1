import React from 'react';

function Partners({ language, content }) {
  const t = content[language];

  const partners = [
    { name: 'Partner 1', logo: `${process.env.PUBLIC_URL}/partner 1.jpeg` },
    { name: 'Partner 2', logo: `${process.env.PUBLIC_URL}/Partener 2.png` },
    { name: 'Partner 3', logo: `${process.env.PUBLIC_URL}/parnter 3.jpeg` },
    { name: 'Partner 4', logo: `${process.env.PUBLIC_URL}/parnter 4.jpeg` },
  ];

  return (
    <section className="partners page-section scroll-animate">
      <div className="container">
        <h2>{t.partners.title}</h2>
        <p className="partners-intro">{t.partners.intro}</p>
        
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
              <img src={partner.logo} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
