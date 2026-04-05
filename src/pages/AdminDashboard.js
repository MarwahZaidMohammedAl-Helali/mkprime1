import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { 
  getCareers, addCareer, updateCareer, deleteCareer,
  getServices, addService, updateService, deleteService,
  getPartners, addPartner, updatePartner, deletePartner,
  getAboutInfo, updateAboutInfo,
  getHeroContent, updateHeroContent
} from '../services/dataService';

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

  // Load all content from Supabase on mount
  useEffect(() => {
    const loadAllContent = async () => {
      try {
        setLoading(true);
        setAdminStatus('Loading admin data from Supabase...');
        
        // Load all data from Supabase
        const [careersData, servicesData, partnersData, aboutData, heroData] = await Promise.all([
          getCareers(),
          getServices(),
          getPartners(),
          getAboutInfo(),
          getHeroContent()
        ]);
        
        setCareers(careersData);
        setServices(servicesData);
        setPartners(partnersData);
        setAboutInfo(aboutData);
        setHeroContent(heroData);
        
        setAdminStatus('✓ Data loaded from Supabase');
        setLoading(false);
      } catch (error) {
        console.error('Error loading content from Supabase:', error);
        setAdminStatus('✗ Error loading admin data');
        setLoading(false);
      }
    };
    
    loadAllContent();
  }, []);

  // Remove localStorage sync effects - Supabase handles persistence
  // Data changes will be reflected immediately in the database

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  // About Info Management
  const updateAboutHandler = async (field, value) => {
    try {
      const updatedAbout = { ...aboutInfo, [field]: value };
      await updateAboutInfo(updatedAbout);
      setAboutInfo(updatedAbout);
    } catch (error) {
      console.error('Error updating about info:', error);
      alert('Error updating about info. Please try again.');
    }
  };

  // Hero Content Management
  const updateHeroHandler = async (field, value) => {
    try {
      const updatedHero = { ...heroContent, [field]: value };
      await updateHeroContent(updatedHero);
      setHeroContent(updatedHero);
    } catch (error) {
      console.error('Error updating hero content:', error);
      alert('Error updating hero content. Please try again.');
    }
  };

  // Career Management
  const addCareerHandler = async () => {
    try {
      const newCareer = {
        titleEn: 'New Position',
        titleAr: 'وظيفة جديدة',
        type: 'Full-time',
        typeAr: 'دوام كامل',
        descEn: 'Job description',
        descAr: 'وصف الوظيفة'
      };
      const addedCareer = await addCareer(newCareer);
      setCareers([...careers, {
        id: addedCareer.id,
        titleEn: addedCareer.title_en,
        titleAr: addedCareer.title_ar,
        type: addedCareer.type_en,
        typeAr: addedCareer.type_ar,
        descEn: addedCareer.description_en,
        descAr: addedCareer.description_ar
      }]);
    } catch (error) {
      console.error('Error adding career:', error);
      alert('Error adding career. Please try again.');
    }
  };

  const updateCareerHandler = async (id, field, value) => {
    try {
      console.log('Updating career:', { id, field, value });
      const updates = { [field]: value };
      const result = await updateCareer(id, updates);
      console.log('Update result:', result);
      setCareers(careers.map(career => 
        career.id === id ? { ...career, [field]: value } : career
      ));
      console.log('Career updated successfully');
    } catch (error) {
      console.error('Error updating career:', error);
      alert(`Error updating career: ${error.message}`);
    }
  };

  const deleteCareerHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        await deleteCareer(id);
        setCareers(careers.filter(career => career.id !== id));
      } catch (error) {
        console.error('Error deleting career:', error);
        alert('Error deleting career. Please try again.');
      }
    }
  };

  // Service Management
  const addServiceHandler = async () => {
    try {
      const newService = {
        titleEn: 'New Service',
        titleAr: 'خدمة جديدة',
        descEn: 'Service description',
        descAr: 'وصف الخدمة',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
        displayOrder: services.length + 1
      };
      const addedService = await addService(newService);
      setServices([...services, {
        id: addedService.id,
        titleEn: addedService.title_en,
        titleAr: addedService.title_ar,
        descEn: addedService.description_en,
        descAr: addedService.description_ar,
        imageUrl: addedService.image_url
      }]);
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Error adding service. Please try again.');
    }
  };

  const updateServiceHandler = async (id, field, value) => {
    try {
      const updates = { [field]: value };
      await updateService(id, updates);
      setServices(services.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      ));
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Error updating service. Please try again.');
    }
  };

  const deleteServiceHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service. Please try again.');
      }
    }
  };

  // Partner Management
  const addPartnerHandler = async () => {
    try {
      const newPartner = {
        nameEn: 'New Partner',
        nameAr: 'New Partner',
        logoPath: 'logo.png',
        order: partners.length + 1
      };
      const addedPartner = await addPartner(newPartner);
      setPartners([...partners, {
        id: addedPartner.id,
        nameEn: addedPartner.name_en,
        nameAr: addedPartner.name_ar,
        logoPath: addedPartner.logo_path,
        order: addedPartner.display_order
      }]);
    } catch (error) {
      console.error('Error adding partner:', error);
      alert('Error adding partner. Please try again.');
    }
  };

  const updatePartnerHandler = async (id, field, value) => {
    try {
      const updates = { [field]: value };
      await updatePartner(id, updates);
      setPartners(partners.map(partner => 
        partner.id === id ? { ...partner, [field]: value } : partner
      ));
    } catch (error) {
      console.error('Error updating partner:', error);
      alert('Error updating partner. Please try again.');
    }
  };

  const deletePartnerHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
        setPartners(partners.filter(partner => partner.id !== id));
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Error deleting partner. Please try again.');
      }
    }
  };

  const movePartnerUp = async (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index > 0) {
      const newPartners = [...partners];
      [newPartners[index - 1], newPartners[index]] = [newPartners[index], newPartners[index - 1]];
      // Update order values
      newPartners.forEach((p, i) => p.order = i + 1);
      setPartners(newPartners);
      
      // Update orders in database
      try {
        await Promise.all(newPartners.map(p => updatePartner(p.id, { order: p.order })));
      } catch (error) {
        console.error('Error updating partner order:', error);
      }
    }
  };

  const movePartnerDown = async (id) => {
    const index = partners.findIndex(p => p.id === id);
    if (index < partners.length - 1) {
      const newPartners = [...partners];
      [newPartners[index], newPartners[index + 1]] = [newPartners[index + 1], newPartners[index]];
      // Update order values
      newPartners.forEach((p, i) => p.order = i + 1);
      setPartners(newPartners);
      
      // Update orders in database
      try {
        await Promise.all(newPartners.map(p => updatePartner(p.id, { order: p.order })));
      } catch (error) {
        console.error('Error updating partner order:', error);
      }
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
              <button className="add-button" onClick={addCareerHandler}>
                + Add New Career
              </button>
              
              <div className="careers-list">
                {careers.map(career => (
                  <div key={career.id} className="career-item">
                    <div className="item-header">
                      <h3>Career #{career.id}</h3>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteCareerHandler(career.id)}
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
                          onChange={(e) => updateCareerHandler(career.id, 'titleEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Title (Arabic)</label>
                        <input
                          type="text"
                          value={career.titleAr}
                          onChange={(e) => updateCareerHandler(career.id, 'titleAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Type (English)</label>
                        <select
                          value={career.type}
                          onChange={(e) => updateCareerHandler(career.id, 'type', e.target.value)}
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
                          onChange={(e) => updateCareerHandler(career.id, 'typeAr', e.target.value)}
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
                          onChange={(e) => updateCareerHandler(career.id, 'descEn', e.target.value)}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Arabic)</label>
                        <textarea
                          value={career.descAr}
                          onChange={(e) => updateCareerHandler(career.id, 'descAr', e.target.value)}
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
                    onChange={(e) => updateAboutHandler('descEn', e.target.value)}
                    rows="5"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Description (Arabic)</label>
                  <textarea
                    value={aboutInfo.descAr}
                    onChange={(e) => updateAboutHandler('descAr', e.target.value)}
                    rows="5"
                    dir="rtl"
                  />
                </div>
                
                <div className="form-group">
                  <label>Founded Year</label>
                  <input
                    type="text"
                    value={aboutInfo.founded}
                    onChange={(e) => updateAboutHandler('founded', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Team Size</label>
                  <input
                    type="text"
                    value={aboutInfo.team}
                    onChange={(e) => updateAboutHandler('team', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Company Type (English)</label>
                  <input
                    type="text"
                    value={aboutInfo.type}
                    onChange={(e) => updateAboutHandler('type', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Company Type (Arabic)</label>
                  <input
                    type="text"
                    value={aboutInfo.typeAr}
                    onChange={(e) => updateAboutHandler('typeAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="services-management">
              <button className="add-button" onClick={addServiceHandler}>
                + Add New Service
              </button>
              
              <div className="services-list">
                {services.map(service => (
                  <div key={service.id} className="service-item">
                    <div className="item-header">
                      <h3>Service #{service.id}</h3>
                      <button 
                        className="delete-button" 
                        onClick={() => deleteServiceHandler(service.id)}
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
                          onChange={(e) => updateServiceHandler(service.id, 'titleEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Title (Arabic)</label>
                        <input
                          type="text"
                          value={service.titleAr}
                          onChange={(e) => updateServiceHandler(service.id, 'titleAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (English)</label>
                        <textarea
                          value={service.descEn}
                          onChange={(e) => updateServiceHandler(service.id, 'descEn', e.target.value)}
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Description (Arabic)</label>
                        <textarea
                          value={service.descAr}
                          onChange={(e) => updateServiceHandler(service.id, 'descAr', e.target.value)}
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
              <button className="add-button" onClick={addPartnerHandler}>
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
                          onClick={() => deletePartnerHandler(partner.id)}
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
                          onChange={(e) => updatePartnerHandler(partner.id, 'nameEn', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Name (Arabic)</label>
                        <input
                          type="text"
                          value={partner.nameAr}
                          onChange={(e) => updatePartnerHandler(partner.id, 'nameAr', e.target.value)}
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="form-group full-width">
                        <label>Partner Logo</label>
                        <ImageUploader
                          currentImage={partner.logoPath}
                          onImageChange={(filename) => updatePartnerHandler(partner.id, 'logoPath', filename)}
                          onImageDelete={() => updatePartnerHandler(partner.id, 'logoPath', '')}
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
                    onChange={(e) => updateHeroHandler('titleEn', e.target.value)}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Title (Arabic)</label>
                  <input
                    type="text"
                    value={heroContent.titleAr}
                    onChange={(e) => updateHeroHandler('titleAr', e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Subtitle (English)</label>
                  <textarea
                    value={heroContent.subtitleEn}
                    onChange={(e) => updateHeroHandler('subtitleEn', e.target.value)}
                    rows="2"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Subtitle (Arabic)</label>
                  <textarea
                    value={heroContent.subtitleAr}
                    onChange={(e) => updateHeroHandler('subtitleAr', e.target.value)}
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
