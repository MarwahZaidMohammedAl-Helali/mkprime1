import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import contentService from '../services/contentService';

// Default data constants
const DEFAULT_CAREERS = [
  {
    id: 1,
    titleEn: 'Student Coordinator (Remote)',
    titleAr: 'منسق الطلاب (عن بُعد)',
    type: 'Flexible Hours',
    typeAr: 'ساعات مرنة',
    descEn: 'Support students academically and socially while coordinating activities, managing data, and assisting with student engagement.',
    descAr: 'دعم الطلاب أكاديمياً واجتماعياً مع تنسيق الأنشطة وإدارة البيانات والمساعدة في مشاركة الطلاب.'
  }
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('careers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState('Connecting...');
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const [careers, setCareers] = useState([]);
  const [aboutInfo, setAboutInfo] = useState({});
  const [services, setServices] = useState([]);
  const [heroContent, setHeroContent] = useState({});
  const [partners, setPartners] = useState([]);

  // Load all content from Firebase on mount
  // Load all content from MongoDB on mount
  useEffect(() => {
    const loadAllContent = async () => {
      try {
        setLoading(true);
        setAdminStatus('Loading admin data...');
        
        const content = await contentService.getAllContent();
        
        // Load careers
        if (content.careers && content.careers.jobs && Array.isArray(content.careers.jobs)) {
          setCareers(content.careers.jobs);
        } else {
          setCareers(DEFAULT_CAREERS);
        }
        
        // Load about info
        if (content.aboutInfo && Object.keys(content.aboutInfo).length > 0) {
          setAboutInfo(content.aboutInfo);
        } else {
          const defaultAbout = {
            descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
            descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
            founded: '2023',
            team: '10-50',
            type: 'Digital Company',
            typeAr: 'شركة رقمية'
          };
          setAboutInfo(defaultAbout);
        }
        
        // Load services
        if (content.services && content.services.services && Array.isArray(content.services.services)) {
          setServices(content.services.services);
        } else {
          const defaultServices = [
            {
              id: 1,
              titleEn: 'Academic Support',
              titleAr: 'الدعم الأكاديمي',
              descEn: 'Comprehensive support to help students excel in their studies',
              descAr: 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم',
              imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'
            },
            {
              id: 2,
              titleEn: 'Educational Consulting',
              titleAr: 'الاستشارات التعليمية',
              descEn: 'Expert guidance for academic planning and career development',
              descAr: 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي',
              imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80'
            },
            {
              id: 3,
              titleEn: 'Edu Technology Solutions',
              titleAr: 'حلول التكنولوجيا التعليمية',
              descEn: 'Innovative tech tools and resources for academic success',
              descAr: 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي',
              imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80'
            },
            {
              id: 4,
              titleEn: 'Quality Education Programs',
              titleAr: 'برامج تعليمية عالية الجودة',
              descEn: 'We offer programs with a high quality of education and a strong learning system',
              descAr: 'نقدم برامج ذات جودة تعليمية عالية ونظام تعلم قوي',
              imageUrl: `${process.env.PUBLIC_URL}/quality-education.jpg`
            }
          ];
          setServices(defaultServices);
        }
        
        // Load hero content
        if (content.heroContent && Object.keys(content.heroContent).length > 0) {
          setHeroContent(content.heroContent);
        } else {
          const defaultHero = {
            titleEn: 'Empowering Students Across EA & GCC',
            titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
            subtitleEn: 'Specialized services designed to support your academic journey',
            subtitleAr: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية'
          };
          setHeroContent(defaultHero);
        }
        
        // Load partners
        if (content.partners && content.partners.partners && Array.isArray(content.partners.partners)) {
          setPartners(content.partners.partners);
        } else {
          const defaultPartners = [
            { id: 1, nameEn: 'MK Elite', nameAr: 'MK Elite', logoPath: 'partner 1.jpeg', order: 1 },
            { id: 2, nameEn: 'ALQAWASMI', nameAr: 'ALQAWASMI', logoPath: 'Partener 2.png', order: 2 },
            { id: 3, nameEn: 'Management & Science University', nameAr: 'Management & Science University', logoPath: 'parnter 3.jpeg', order: 3 },
            { id: 4, nameEn: 'UCSI University', nameAr: 'UCSI University', logoPath: 'parnter 4.jpeg', order: 4 },
            { id: 5, nameEn: 'Duy Tân University', nameAr: 'Duy Tân University', logoPath: 'partener 5.jpeg', order: 5 }
          ];
          setPartners(defaultPartners);
        }
        
        setAdminStatus('✓ Connected to MongoDB');
        setLoading(false);
      } catch (error) {
        console.error('Error loading content from MongoDB:', error);
        setAdminStatus('⚠️ Using local storage (MongoDB unavailable)');
        
        // Fallback to localStorage
        try {
          const careersData = localStorage.getItem('careers');
          if (careersData) {
            const parsed = JSON.parse(careersData);
            setCareers(parsed?.jobs || parsed || DEFAULT_CAREERS);
          } else {
            setCareers(DEFAULT_CAREERS);
          }
          
          const aboutData = localStorage.getItem('aboutInfo');
          if (aboutData) {
            setAboutInfo(JSON.parse(aboutData));
          }
          
          const servicesData = localStorage.getItem('services');
          if (servicesData) {
            const parsed = JSON.parse(servicesData);
            setServices(parsed?.services || parsed || []);
          }
          
          const heroData = localStorage.getItem('heroContent');
          if (heroData) {
            setHeroContent(JSON.parse(heroData));
          }
          
          const partnersData = localStorage.getItem('partners');
          if (partnersData) {
            const parsed = JSON.parse(partnersData);
            setPartners(parsed?.partners || parsed || []);
          }
        } catch (localError) {
          console.error('Error loading from localStorage:', localError);
          setAdminStatus('✗ Error loading admin data');
        }
        
        setLoading(false);
      }
    };
    
    loadAllContent();
  }, []);

  // Save to MongoDB whenever data changes (with localStorage backup)
  useEffect(() => {
    if (!loading && careers.length > 0) {
      const saveData = async () => {
        try {
          await contentService.updateCareers(careers);
        } catch (error) {
          console.error('Error saving careers to MongoDB:', error);
          // Fallback to localStorage
          localStorage.setItem('careers', JSON.stringify({ jobs: careers }));
        }
      };
      saveData();
    }
  }, [careers, loading]);

  useEffect(() => {
    if (!loading && Object.keys(aboutInfo).length > 0) {
      const saveData = async () => {
        try {
          await contentService.updateAboutInfo(aboutInfo);
        } catch (error) {
          console.error('Error saving about info to MongoDB:', error);
          localStorage.setItem('aboutInfo', JSON.stringify(aboutInfo));
        }
      };
      saveData();
    }
  }, [aboutInfo, loading]);

  useEffect(() => {
    if (!loading && services.length > 0) {
      const saveData = async () => {
        try {
          await contentService.updateServices(services);
        } catch (error) {
          console.error('Error saving services to MongoDB:', error);
          localStorage.setItem('services', JSON.stringify({ services: services }));
        }
      };
      saveData();
    }
  }, [services, loading]);

  useEffect(() => {
    if (!loading && Object.keys(heroContent).length > 0) {
      const saveData = async () => {
        try {
          await contentService.updateHeroContent(heroContent);
        } catch (error) {
          console.error('Error saving hero content to MongoDB:', error);
          localStorage.setItem('heroContent', JSON.stringify(heroContent));
        }
      };
      saveData();
    }
  }, [heroContent, loading]);

  useEffect(() => {
    if (!loading && partners.length > 0) {
      const saveData = async () => {
        try {
          await contentService.updatePartners(partners);
        } catch (error) {
          console.error('Error saving partners to MongoDB:', error);
          localStorage.setItem('partners', JSON.stringify({ partners: partners }));
        }
      };
      saveData();
    }
  }, [partners, loading]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  // Career Management
  const addCareer = () => {
    const newCareer = {
      id: Date.now(),
      titleEn: 'New Position',
      titleAr: 'وظيفة جديدة',
      type: 'Full-time',
      typeAr: 'دوام كامل',
      descEn: 'Job description',
      descAr: 'وصف الوظيفة'
    };
    setCareers([...careers, newCareer]);
  };

  const updateCareer = (id, field, value) => {
    setCareers(careers.map(career => 
      career.id === id ? { ...career, [field]: value } : career
    ));
  };

  const deleteCareer = (id) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      setCareers(careers.filter(career => career.id !== id));
    }
  };

  // Service Management
  const addService = () => {
    const newService = {
      id: Date.now(),
      titleEn: 'New Service',
      titleAr: 'خدمة جديدة',
      descEn: 'Service description',
      descAr: 'وصف الخدمة',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'
    };
    setServices([...services, newService]);
  };

  const updateService = (id, field, value) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  // Partner Management
  const addPartner = () => {
    const newPartner = {
      id: Date.now(),
      nameEn: 'New Partner',
      nameAr: 'شريك جديد',
      logoPath: 'logo.png',
      order: partners.length + 1
    };
    setPartners([...partners, newPartner]);
  };

  const updatePartner = (id, field, value) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, [field]: value } : partner
    ));
  };

  const deletePartner = (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      setPartners(partners.filter(partner => partner.id !== id));
    }
  };

  const movePartnerUp = (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index > 0) {
      const newPartners = [...partners];
      [newPartners[index - 1], newPartners[index]] = [newPartners[index], newPartners[index - 1]];
      // Update order values
      newPartners.forEach((p, i) => p.order = i + 1);
      setPartners(newPartners);
    }
  };

  const movePartnerDown = (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index < partners.length - 1) {
      const newPartners = [...partners];
      [newPartners[index], newPartners[index + 1]] = [newPartners[index + 1], newPartners[index]];
      // Update order values
      newPartners.forEach((p, i) => p.order = i + 1);
      setPartners(newPartners);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={`admin-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>MKPRIME Admin</h2>
          <button 
            className={`admin-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        {/* Admin Status */}
        <div style={{ 
          padding: '10px 20px', 
          fontSize: '12px', 
          color: adminStatus.includes('✓') ? '#4CAF50' : adminStatus.includes('✗') ? '#f44336' : '#ff9800',
          borderBottom: '1px solid #eee',
          textAlign: 'center'
        }}>
          {adminStatus}
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'careers' ? 'active' : ''} 
            onClick={() => { setActiveTab('careers'); closeMobileMenu(); }}
          >
            📋 Careers
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''} 
            onClick={() => { setActiveTab('services'); closeMobileMenu(); }}
          >
            🛠️ Services
          </button>
          <button 
            className={activeTab === 'partners' ? 'active' : ''} 
            onClick={() => { setActiveTab('partners'); closeMobileMenu(); }}
          >
            🤝 Partners
          </button>
          <button 
            className={activeTab === 'about' ? 'active' : ''} 
            onClick={() => { setActiveTab('about'); closeMobileMenu(); }}
          >
            ℹ️ About Us
          </button>
          <button 
            className={activeTab === 'hero' ? 'active' : ''} 
            onClick={() => { setActiveTab('hero'); closeMobileMenu(); }}
          >
            🏠 Hero Section
          </button>
        </nav>
        
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <button 
            className={`admin-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>
            {activeTab === 'careers' && 'Manage Careers'}
            {activeTab === 'services' && 'Manage Services'}
            {activeTab === 'partners' && 'Manage Partners'}
            {activeTab === 'about' && 'Manage About Us'}
            {activeTab === 'hero' && 'Manage Hero Section'}
          </h1>
        </div>

        <div className="content-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
              <div style={{ marginBottom: '20px' }}>⏳ Loading admin panel...</div>
            </div>
          ) : (
            <>
          {/* Careers Tab */}
          {activeTab === 'careers' && (
            <div className="careers-management">
              <button className="add-button" onClick={addCareer}>
                + Add New Career
              </button>
              
              <div className="careers-list">
                {careers.map(career => (
                  <div key={career.id} className="career-item">
                    <div className="item-header">
                      <h3>Career #{career.id}</h3>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteCareer(career.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Title (English)</label>
                        <input
                          type="text"
                          value={career.titleEn}
                          onChange={(e) => updateCareer(career.id, 'titleEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Title (Arabic)</label>
                        <input
                          type="text"
                          value={career.titleAr}
                          onChange={(e) => updateCareer(career.id, 'titleAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Type (English)</label>
                        <select
                          value={career.type}
                          onChange={(e) => updateCareer(career.id, 'type', e.target.value)}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Flexible Hours">Flexible Hours</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Type (Arabic)</label>
                        <select
                          value={career.typeAr}
                          onChange={(e) => updateCareer(career.id, 'typeAr', e.target.value)}
                        >
                          <option value="دوام كامل">دوام كامل</option>
                          <option value="دوام جزئي">دوام جزئي</option>
                          <option value="عقد">عقد</option>
                          <option value="ساعات مرنة">ساعات مرنة</option>
                        </select>
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (English)</label>
                        <textarea
                          value={career.descEn}
                          onChange={(e) => updateCareer(career.id, 'descEn', e.target.value)}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Arabic)</label>
                        <textarea
                          value={career.descAr}
                          onChange={(e) => updateCareer(career.id, 'descAr', e.target.value)}
                          rows="3"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="about-management">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Description (English)</label>
                  <textarea
                    value={aboutInfo.descEn}
                    onChange={(e) => setAboutInfo({...aboutInfo, descEn: e.target.value})}
                    rows="5"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Description (Arabic)</label>
                  <textarea
                    value={aboutInfo.descAr}
                    onChange={(e) => setAboutInfo({...aboutInfo, descAr: e.target.value})}
                    rows="5"
                    dir="rtl"
                  />
                </div>
                
                <div className="form-group">
                  <label>Founded Year</label>
                  <input
                    type="text"
                    value={aboutInfo.founded}
                    onChange={(e) => setAboutInfo({...aboutInfo, founded: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team Size</label>
                  <input
                    type="text"
                    value={aboutInfo.team}
                    onChange={(e) => setAboutInfo({...aboutInfo, team: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Company Type (English)</label>
                  <input
                    type="text"
                    value={aboutInfo.type}
                    onChange={(e) => setAboutInfo({...aboutInfo, type: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Company Type (Arabic)</label>
                  <input
                    type="text"
                    value={aboutInfo.typeAr}
                    onChange={(e) => setAboutInfo({...aboutInfo, typeAr: e.target.value})}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="services-management">
              <button className="add-button" onClick={addService}>
                + Add New Service
              </button>
              
              <div className="services-list">
                {services.map(service => (
                  <div key={service.id} className="service-item">
                    <div className="item-header">
                      <h3>Service #{service.id}</h3>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteService(service.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Title (English)</label>
                        <input
                          type="text"
                          value={service.titleEn}
                          onChange={(e) => updateService(service.id, 'titleEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Title (Arabic)</label>
                        <input
                          type="text"
                          value={service.titleAr}
                          onChange={(e) => updateService(service.id, 'titleAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (English)</label>
                        <textarea
                          value={service.descEn}
                          onChange={(e) => updateService(service.id, 'descEn', e.target.value)}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Arabic)</label>
                        <textarea
                          value={service.descAr}
                          onChange={(e) => updateService(service.id, 'descAr', e.target.value)}
                          rows="3"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="partners-management">
              <button className="add-button" onClick={addPartner}>
                + Add New Partner
              </button>
              
              <div className="partners-list">
                {partners.sort((a, b) => a.order - b.order).map((partner, index) => (
                  <div key={partner.id} className="partner-item">
                    <div className="item-header">
                      <h3>Partner #{partner.order}</h3>
                      <div className="button-group">
                        <button 
                          className="order-button" 
                          onClick={() => movePartnerUp(partner.id)}
                          disabled={index === 0}
                          title="Move Up"
                        >
                          ⬆️
                        </button>
                        <button 
                          className="order-button" 
                          onClick={() => movePartnerDown(partner.id)}
                          disabled={index === partners.length - 1}
                          title="Move Down"
                        >
                          ⬇️
                        </button>
                        <button 
                          className="delete-button" 
                          onClick={() => deletePartner(partner.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Name (English)</label>
                        <input
                          type="text"
                          value={partner.nameEn}
                          onChange={(e) => updatePartner(partner.id, 'nameEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Name (Arabic)</label>
                        <input
                          type="text"
                          value={partner.nameAr}
                          onChange={(e) => updatePartner(partner.id, 'nameAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Partner Logo</label>
                        <ImageUploader
                          currentImage={partner.logoPath}
                          onImageChange={(filename) => updatePartner(partner.id, 'logoPath', filename)}
                          onImageDelete={() => updatePartner(partner.id, 'logoPath', '')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <div className="hero-management">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Title (English)</label>
                  <input
                    type="text"
                    value={heroContent.titleEn}
                    onChange={(e) => setHeroContent({...heroContent, titleEn: e.target.value})}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Title (Arabic)</label>
                  <input
                    type="text"
                    value={heroContent.titleAr}
                    onChange={(e) => setHeroContent({...heroContent, titleAr: e.target.value})}
                    dir="rtl"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Subtitle (English)</label>
                  <textarea
                    value={heroContent.subtitleEn}
                    onChange={(e) => setHeroContent({...heroContent, subtitleEn: e.target.value})}
                    rows="2"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Subtitle (Arabic)</label>
                  <textarea
                    value={heroContent.subtitleAr}
                    onChange={(e) => setHeroContent({...heroContent, subtitleAr: e.target.value})}
                    rows="2"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
