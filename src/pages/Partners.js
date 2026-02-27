import { useState, useEffect, useMemo, useCallback } from 'react';
import { getContent } from '../firebaseHelpers';

function Partners({ language, content }) {
  const t = content[language];
  
  // Load partners from Firebase
  const [partners, setPartners] = useState([]);
  
  // Default partners constant
  const DEFAULT_PARTNERS = useMemo(() => [
    { 
      id: 1,
      nameEn: 'MK Elite',
      nameAr: 'MK Elite',
      logoPath: 'partner 1.jpeg',
      order: 1
    },
    { 
      id: 2,
      nameEn: 'ALQAWASMI',
      nameAr: 'ALQAWASMI',
      logoPath: 'Partener 2.png',
      order: 2
    },
    { 
      id: 3,
      nameEn: 'Management & Science University',
      nameAr: 'Management & Science University',
      logoPath: 'parnter 3.jpeg',
      order: 3
    },
    { 
      id: 4,
      nameEn: 'UCSI University',
      nameAr: 'UCSI University',
      logoPath: 'parnter 4.jpeg',
      order: 4
    },
    { 
      id: 5,
      nameEn: 'Duy Tân University',
      nameAr: 'Duy Tân University',
      logoPath: 'partener 5.jpeg',
      order: 5
    },
  ], []);

  // Validate partner object has all required fields
  const validatePartner = (partner) => {
    if (!partner || typeof partner !== 'object') {
      console.warn('Invalid partner object:', partner);
      return false;
    }
    
    const requiredFields = ['id', 'nameEn', 'nameAr', 'logoPath', 'order'];
    const missingFields = requiredFields.filter(field => !(field in partner));
    
    if (missingFields.length > 0) {
      console.warn(`Partner missing required fields: ${missingFields.join(', ')}`, partner);
      return false;
    }
    
    return true;
  };

  // Initialize default partners
  const initializeDefaultPartners = useCallback(() => {
    console.log('Using default partners');
    return DEFAULT_PARTNERS;
  }, [DEFAULT_PARTNERS]);
  
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const partnersData = await getContent('partners');
        
        if (partnersData && partnersData.partners && Array.isArray(partnersData.partners)) {
          // Filter out invalid partners
          const validPartners = partnersData.partners.filter(validatePartner);
          
          if (validPartners.length === 0) {
            console.warn('No valid partners found, using defaults');
            const defaults = initializeDefaultPartners();
            setPartners(defaults.sort((a, b) => a.order - b.order));
            return;
          }
          
          if (validPartners.length < partnersData.partners.length) {
            console.warn(`Filtered out ${partnersData.partners.length - validPartners.length} invalid partners`);
          }
          
          setPartners(validPartners.sort((a, b) => a.order - b.order));
        } else {
          console.log('No partners in Firebase, using defaults');
          const defaults = initializeDefaultPartners();
          setPartners(defaults.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error('Error loading partners from Firebase:', error);
        setPartners(DEFAULT_PARTNERS.sort((a, b) => a.order - b.order));
      }
    };
    
    loadPartners();
    
    // Reload every 5 seconds to get updates from admin panel
    const interval = setInterval(loadPartners, 5000);
    
    return () => clearInterval(interval);
  }, [DEFAULT_PARTNERS, initializeDefaultPartners]);

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
