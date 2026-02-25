import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function JobApplication({ language, content, countries }) {
  const navigate = useNavigate();
  const location = useLocation();
  const jobPosition = location.state?.jobPosition || 'General Application';
  
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    currentCountry: '',
    countryCode: '+974',
    phone: '',
    email: '',
    cv: null,
    whyHireYou: '',
    jobPosition: jobPosition
  });
  const [formStatus, setFormStatus] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectedCountry, setDetectedCountry] = useState({ iso: 'QA', name: 'Qatar' });

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.nameAr.includes(searchTerm) ||
    country.code.includes(searchTerm)
  );

  // Auto-detect user's country
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            const match = countries.find((c) => c.iso === data.country_code);
            if (match) {
              setFormData((prev) => ({ 
                ...prev, 
                countryCode: match.code,
                currentCountry: language === 'ar' ? match.nameAr : match.name
              }));
              setDetectedCountry({ iso: data.country_code, name: data.country_name || match.name });
              return;
            }
          }
        }
      } catch (e) {
        // Keep default
      }
    };

    detectCountry();
  }, [countries, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(language === 'ar' ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' : 'File size too large. Maximum 5MB');
        e.target.value = '';
        return;
      }
      setFormData({
        ...formData,
        cv: file
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const fullPhone = `${formData.countryCode} ${formData.phone}`;

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('nationality', formData.nationality);
    submitData.append('currentCountry', formData.currentCountry);
    submitData.append('phone', fullPhone);
    submitData.append('email', formData.email);
    submitData.append('whyHireYou', formData.whyHireYou);
    submitData.append('jobPosition', formData.jobPosition);
    submitData.append('detectedCountry', detectedCountry.name);
    submitData.append('detectedCountryCode', detectedCountry.iso);
    if (formData.cv) {
      submitData.append('cv', formData.cv);
    }

    try {
      // Use Vercel serverless function
      const apiUrl = '/api/job-application';

      console.log('Sending job application to:', apiUrl);
      console.log('Form data:', {
        name: formData.name,
        nationality: formData.nationality,
        currentCountry: formData.currentCountry,
        phone: fullPhone,
        email: formData.email,
        jobPosition: formData.jobPosition,
        cvFile: formData.cv ? formData.cv.name : 'No CV'
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: submitData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
        console.log('Response JSON:', result);
      } else {
        const text = await response.text();
        console.log('Response text:', text);
        result = { success: false, message: 'Invalid response format', details: text };
      }

      if (response.ok && result.success) {
        setFormStatus('success');
        setFormData({ 
          name: '', 
          nationality: '', 
          currentCountry: '', 
          countryCode: '+974', 
          phone: '', 
          email: '', 
          cv: null, 
          whyHireYou: '',
          jobPosition: jobPosition
        });
        // Reset file input
        document.getElementById('cv-upload').value = '';
        setTimeout(() => {
          navigate('/careers');
        }, 3000);
      } else {
        console.error('Form submission failed:', result);
        setFormStatus('error');
        alert(`Error: ${result.message || 'Unknown error occurred'}\n\nStatus: ${response.status}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setFormStatus('error');
      alert(`Network Error: ${error.message}\n\nPlease check:\n1. Your internet connection\n2. The API endpoint is accessible\n3. File size is under 5MB\n4. CORS settings are correct`);
    }
  };

  return (
    <section className="job-application page-section">
      <div className="container">
        <div className="application-wrapper">
          <div className="application-header">
            <h2>{language === 'ar' ? 'تقديم طلب وظيفة' : 'Job Application'}</h2>
            <p className="job-position-title">{jobPosition}</p>
            <p>{language === 'ar' ? 'املأ النموذج أدناه للتقديم على الوظيفة' : 'Fill out the form below to apply for a position'}</p>
          </div>

          <form className="application-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-field">
              <label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</label>
              <input
                type="text"
                name="name"
                placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Nationality */}
            <div className="form-field">
              <label>{language === 'ar' ? 'الجنسية' : 'Nationality'} *</label>
              <input
                type="text"
                name="nationality"
                placeholder={language === 'ar' ? 'أدخل جنسيتك' : 'Enter your nationality'}
                value={formData.nationality}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Current Country */}
            <div className="form-field">
              <label>{language === 'ar' ? 'البلد الحالي' : 'Current Country'} *</label>
              <input
                type="text"
                name="currentCountry"
                placeholder={language === 'ar' ? 'أدخل بلدك الحالي' : 'Enter your current country'}
                value={formData.currentCountry}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-field">
              <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</label>
              <input
                type="email"
                name="email"
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-field">
              <label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
              <div className="custom-phone-input">
                <div className="country-dropdown">
                  <button
                    type="button"
                    className="country-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${countries.find((c) => c.code === formData.countryCode)?.iso.toLowerCase()}.png`}
                      alt="flag"
                      className="flag-img"
                    />
                    <span>{formData.countryCode}</span>
                    <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="country-list">
                      <input
                        type="text"
                        placeholder={language === 'ar' ? 'ابحث عن دولة...' : 'Search country...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="country-search"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="country-options">
                        {filteredCountries.map((country) => (
                          <div
                            key={country.code}
                            className="country-option"
                            onClick={() => {
                              setFormData({ ...formData, countryCode: country.code });
                              setSearchTerm('');
                              setIsDropdownOpen(false);
                            }}
                          >
                            <img
                              src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`}
                              alt={country.name}
                              className="flag-img-small"
                            />
                            <span>{language === 'ar' ? country.nameAr : country.name}</span>
                            <span className="country-code-text">{country.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="phone-number-input"
                  required
                />
              </div>
            </div>

            {/* CV Upload */}
            <div className="form-field">
              <label>{language === 'ar' ? 'السيرة الذاتية (PDF)' : 'CV / Resume (PDF)'} *</label>
              <input
                type="file"
                id="cv-upload"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file-input"
                required
              />
              <p className="file-hint">{language === 'ar' ? 'الحد الأقصى: 5 ميجابايت' : 'Maximum: 5MB'}</p>
            </div>

            {/* Why Should We Hire You */}
            <div className="form-field">
              <label>{language === 'ar' ? 'لماذا يجب أن نوظفك؟' : 'Why Should We Hire You?'} *</label>
              <textarea
                name="whyHireYou"
                placeholder={language === 'ar' ? 'أخبرنا لماذا أنت المرشح المثالي...' : 'Tell us why you are the ideal candidate...'}
                value={formData.whyHireYou}
                onChange={handleInputChange}
                rows="6"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={formStatus === 'sending'}>
              {formStatus === 'sending' 
                ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') 
                : (language === 'ar' ? 'إرسال الطلب' : 'Submit Application')}
            </button>

            {/* Status Messages */}
            {formStatus === 'success' && (
              <div className="message-alert success">
                {language === 'ar' ? '✓ تم إرسال طلبك بنجاح! سنتواصل معك قريباً.' : '✓ Application submitted successfully! We will contact you soon.'}
              </div>
            )}
            {formStatus === 'error' && (
              <div className="message-alert error">
                {language === 'ar' ? '✗ حدث خطأ. يرجى المحاولة مرة أخرى.' : '✗ An error occurred. Please try again.'}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default JobApplication;
