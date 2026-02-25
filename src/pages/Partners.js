import React, { useState, useEffect } from 'react';

function Partners({ language, content }) {
  const t = content[language];
  
  // Load partners from localStorage
  const [partners, setPartners] = useState([]);
  
  // Default partners constant
  const DEFAULT_PARTNERS = [
    { 
      id: 1,
      nameEn: 'Management & Science University',
      nameAr: 'جامعة الإدارة والعلوم',
      logoPath: 'partner 1.jpeg',
      order: 1
    },
    { 
      id: 2,
      nameEn: 'UCSI University',
      nameAr: 'جامعة UCSI',
      logoPath: 'Partener 2.png',
      order: 2
    },
    { 
      id: 3,
      nameEn: 'ALQAWASMI',
      nameAr: 'القواسمي',
      logoPath: 'parnter 3.jpeg',
      order: 3
    },
    { 
      id: 4,
      nameEn: 'Duy Tân University',
      nameAr: 'جامعة دوي تان',
      logoPath: 'parnter 4.jpeg',
      order: 4
    },
    { 
      id: 5,
      nameEn: 'MK Elite',
      nameAr: 'إم كي إيليت',
      logoPath: 'partener 5.jpeg',
      order: 5
    },
  ];

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

  // Initialize default partners in localStorage
  const initializeDefaultPartners = () => {
    console.log('Initializing default partners in localStorage');
    try {
      localStorage.setItem('partners', JSON.stringify(DEFAULT_PARTNERS));
      return DEFAULT_PARTNERS;
    } catch (error) {
      console.error('Failed to save default partners to localStorage:', error);
      return DEFAULT_PARTNERS;
    }
  };
  
  useEffect(() => {
    const loadPartners = () => {
      try {
        const saved = localStorage.getItem('partners');
        
        if (saved) {
          // Parse and validate localStorage data
          let parsedPartners;
          try {
            parsedPartners = JSON.parse(saved);
          } catch (parseError) {
            console.error('Failed to parse partners from localStorage:', parseError);
            console.log('Clearing corrupted data and using defaults');
            localStorage.removeItem('partners');
            const defaults = initializeDefaultPartners();
            setPartners(defaults.sort((a, b) => a.order - b.order));
            return;
          }
          
          // Validate it's an array
          if (!Array.isArray(parsedPartners)) {
            console.error('Partners data is not an array:', parsedPartners);
            const defaults = initializeDefaultPartners();
            setPartners(defaults.sort((a, b) => a.order - b.order));
            return;
          }
          
          // Filter out invalid partners
          const validPartners = parsedPartners.filter(validatePartner);
          
          if (validPartners.length === 0) {
            console.warn('No valid partners found, using defaults');
            const defaults = initializeDefaultPartners();
            setPartners(defaults.sort((a, b) => a.order - b.order));
            return;
          }
          
          if (validPartners.length < parsedPartners.length) {
            console.warn(`Filtered out ${parsedPartners.length - validPartners.length} invalid partners`);
          }
          
          setPartners(validPartners.sort((a, b) => a.order - b.order));
        } else {
          // No data in localStorage - initialize with defaults
          console.log('No partners in localStorage, initializing defaults');
          const defaults = initializeDefaultPartners();
          setPartners(defaults.sort((a, b) => a.order - b.order));
        }
      } catch (error) {
        console.error('Error loading partners:', error);
        // Fall back to defaults on any error
        setPartners(DEFAULT_PARTNERS.sort((a, b) => a.order - b.order));
      }
    };
    
    loadPartners();
    
    // Listen for storage changes (when admin updates partners in different tab)
    const handleStorageChange = (e) => {
      if (e.key === 'partners') {
        console.log('Storage event received, reloading partners');
        loadPartners();
      }
    };
    
    // Listen for custom event from same window
    const handleCustomStorageChange = () => {
      console.log('Custom storage event received, reloading partners');
      loadPartners();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
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
