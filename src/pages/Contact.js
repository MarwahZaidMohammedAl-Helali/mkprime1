import React, { useState, useEffect } from 'react';

function Contact({ language, content, countries }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+974',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectedCountry, setDetectedCountry] = useState({ iso: 'QA', name: 'Qatar' });

  const t = content[language];

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.nameAr.includes(searchTerm) ||
    country.code.includes(searchTerm)
  );

  // Auto-detect user's country from their browser
  useEffect(() => {
    const detectCountry = async () => {
      // Try ipapi.co
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            const match = countries.find((c) => c.iso === data.country_code);
            if (match) {
              setFormData((prev) => ({ ...prev, countryCode: match.code }));
              setDetectedCountry({ iso: data.country_code, name: data.country_name || match.name });
              return;
            }
          }
        }
      } catch (e) { 
        // try next 
      }

      // Fallback: ipwho.is
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_code) {
            const match = countries.find((c) => c.iso === data.country_code);
            if (match) {
              setFormData((prev) => ({ ...prev, countryCode: match.code }));
              setDetectedCountry({ iso: data.country_code, name: data.country || match.name });
              return;
            }
          }
        }
      } catch (e) { 
        // keep default 
      }
    };

    detectCountry();
  }, [countries]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    const fullPhone = `${formData.countryCode} ${formData.phone}`;

    try {
      // Use Vercel serverless function
      const apiUrl = '/api/contact';

      console.log('Sending contact form to:', apiUrl);
      console.log('Form data:', {
        name: formData.name,
        email: formData.email,
        phone: fullPhone,
        message: formData.message,
        visitorCountry: detectedCountry.name,
        visitorCountryCode: detectedCountry.iso
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          message: formData.message,
          visitorCountry: detectedCountry.name,
          visitorCountryCode: detectedCountry.iso
        }),
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
        setFormData({ name: '', email: '', countryCode: '+974', phone: '', message: '' });
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        console.error('Form submission failed:', result);
        setFormStatus('error');
        alert(`Error: ${result.message || 'Unknown error occurred'}\n\nStatus: ${response.status}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      alert(`Network Error: ${error.message}\n\nPlease check:\n1. Your internet connection\n2. The API endpoint is accessible\n3. CORS settings are correct`);
    }
  };

  return (
    <section className="contact scroll-animate page-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-header">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.subtitle}</p>
          </div>

          <div className="contact-grid">
            <div className="social-section">
              <div className="contact-image">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" alt="Contact us" />
              </div>

              <div className="social-card">
                <h3>{t.contact.follow_title}</h3>
                <div className="social-buttons">
                  <a href="https://www.facebook.com/share/1dn2pKmeQg/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>{t.contact.facebook}</span>
                  </a>
                  <a href="https://www.instagram.com/mkprimme?igsh=MTNocmNqZjZqYzJsMw==" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>{t.contact.instagram}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>{language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}</h3>
              <form className="modern-contact-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <input
                    type="text"
                    name="name"
                    placeholder={t.contact.name}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    placeholder={t.contact.email}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <div className="custom-phone-input">
                    <div className="country-dropdown">
                      <button
                        type="button"
                        className="country-button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <img
                          src={`https://flagcdn.com/w40/${countries.find(c => c.code === formData.countryCode)?.iso.toLowerCase()}.png`}
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
                <div className="form-field">
                  <textarea
                    name="message"
                    placeholder={t.contact.message}
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button" disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : t.contact.send}
                </button>
                {formStatus === 'success' && (
                  <div className="message-alert success">
                    {language === 'ar' ? '✓ تم إرسال رسالتك بنجاح!' : '✓ Message sent successfully!'}
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

          <div className="contact-footer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{language === 'ar' ? 'شركة رقمية' : 'Digital Company'}</span>
            <span>•</span>
            <span dir="ltr">+974 6659 9688</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
