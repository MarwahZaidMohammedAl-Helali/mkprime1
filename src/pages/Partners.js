import { useState, useEffect } from 'react';
import { getPartners } from '../services/dataService';

function Partners({ language, content }) {
  const t = content[language];
  
  // Load partners from Supabase
  const [partners, setPartners] = useState([]);
  
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const partnersData = await getPartners();
        setPartners(partnersData);
      } catch (error) {
        console.error('Error loading partners:', error);
        setPartners([]);
      }
    };
    
    loadPartners();
  }, []);

  // Get partner name with placeholder for empty values
  const getPartnerName = (partner) => {
    const name = language === 'ar' ? partner.nameAr : partner.nameEn;
    
    if (!name || name.trim() === '') {
      console.warn('Partner has empty name:', partner);
      return language === 'ar' ? 'شريك بدون اسم' : 'Unnamed Partner';
    }
    
    return name;
  };

  return (
    <section className="partners page-section scroll-animate">
      <div className="container">
        <h2>{t.partners.title}</h2>
        <p className="partners-intro">{t.partners.intro}</p>
        
        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <img 
                src={`${process.env.PUBLIC_URL}/${partner.logoPath}`} 
                alt={getPartnerName(partner)} 
              />
              <h3 className="partner-name">{getPartnerName(partner)}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
