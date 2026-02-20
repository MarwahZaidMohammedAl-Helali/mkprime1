import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('careers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Load data from localStorage or use defaults
  const [careers, setCareers] = useState(() => {
    const saved = localStorage.getItem('careers');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        titleEn: 'Academic Advisor',
        titleAr: 'مستشار أكاديمي',
        type: 'Full-time',
        typeAr: 'دوام كامل',
        descEn: 'We are looking for a passionate academic advisor to help students achieve their educational goals',
        descAr: 'نبحث عن مستشار أكاديمي متحمس لمساعدة الطلاب على تحقيق أهدافهم التعليمية'
      },
      {
        id: 2,
        titleEn: 'Educational Technology Specialist',
        titleAr: 'أخصائي تكنولوجيا التعليم',
        type: 'Full-time',
        typeAr: 'دوام كامل',
        descEn: 'Join our team to develop innovative technology solutions for education',
        descAr: 'انضم إلى فريقنا لتطوير حلول تقنية مبتكرة للتعليم'
      },
      {
        id: 3,
        titleEn: 'Student Support Coordinator',
        titleAr: 'منسق دعم الطلاب',
        type: 'Part-time',
        typeAr: 'دوام جزئي',
        descEn: 'Help coordinate support services for international students',
        descAr: 'ساعد في تنسيق خدمات الدعم للطلاب الدوليين'
      }
    ];
  });

  const [aboutInfo, setAboutInfo] = useState(() => {
    const saved = localStorage.getItem('aboutInfo');
    return saved ? JSON.parse(saved) : {
      descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
      descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
      founded: '2023',
      team: '10-15',
      type: 'Digital Company',
      typeAr: 'شركة رقمية'
    };
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        titleEn: 'Academic Support',
        titleAr: 'الدعم الأكاديمي',
        descEn: 'Comprehensive support to help students excel in their studies',
        descAr: 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم'
      },
      {
        id: 2,
        titleEn: 'Educational Consulting',
        titleAr: 'الاستشارات التعليمية',
        descEn: 'Expert guidance for academic planning and career development',
        descAr: 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي'
      },
      {
        id: 3,
        titleEn: 'Edu Technology Solutions',
        titleAr: 'حلول التكنولوجيا التعليمية',
        descEn: 'Innovative tech tools and resources for academic success',
        descAr: 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي'
      }
    ];
  });

  const [heroContent, setHeroContent] = useState(() => {
    const saved = localStorage.getItem('heroContent');
    return saved ? JSON.parse(saved) : {
      titleEn: 'Empowering Students Across EA & GCC',
      titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
      subtitleEn: 'Specialized services designed to support your academic journey',
      subtitleAr: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية'
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('careers', JSON.stringify(careers));
  }, [careers]);

  useEffect(() => {
    localStorage.setItem('aboutInfo', JSON.stringify(aboutInfo));
  }, [aboutInfo]);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('heroContent', JSON.stringify(heroContent));
  }, [heroContent]);

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
  const updateService = (id, field, value) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
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
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'careers' ? 'active' : ''} 
            onClick={() => { setActiveTab('careers'); closeMobileMenu(); }}
          >
            📋 Careers
          </button>
          <button 
            className={activeTab === 'about' ? 'active' : ''} 
            onClick={() => { setActiveTab('about'); closeMobileMenu(); }}
          >
            ℹ️ About Us
          </button>
          <button 
            className={activeTab === 'services' ? 'active' : ''} 
            onClick={() => { setActiveTab('services'); closeMobileMenu(); }}
          >
            🛠️ Services
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
            {activeTab === 'about' && 'Manage About Us'}
            {activeTab === 'services' && 'Manage Services'}
            {activeTab === 'hero' && 'Manage Hero Section'}
          </h1>
        </div>

        <div className="content-body">
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
              {services.map(service => (
                <div key={service.id} className="service-item">
                  <h3>Service {service.id}</h3>
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
