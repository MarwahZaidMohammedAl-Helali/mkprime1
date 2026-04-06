import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import './animations.css';
import './admin.css';
import { getContent, loadDynamicContent } from './contentManager';

// Import pages
import Home from './pages/Home';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import JobApplication from './pages/JobApplication';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
}

function AppContent() {
  const [language, setLanguage] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dynamicContent, setDynamicContent] = useState({});
  const location = useLocation();

  // Check if on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  // Function to load dynamic content
  const loadContent = async () => {
    try {
      console.log('🔄 Starting to load dynamic content from Supabase...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Loading timeout')), 5000)
      );
      
      const content = await Promise.race([
        loadDynamicContent(),
        timeoutPromise
      ]);
      
      console.log('✅ Dynamic content loaded successfully:', content);
      setDynamicContent(content);
    } catch (error) {
      console.error('❌ Error loading content:', error);
      // Set empty content as fallback
      setDynamicContent({
        careers: [],
        services: [],
        partners: [],
        aboutInfo: {},
        heroContent: {}
      });
    } finally {
      console.log('🏁 Content loading completed');
    }
  };

  // Load dynamic content from Supabase on mount
  useEffect(() => {
    loadContent();
  }, []);

  // Add event listener for admin updates
  useEffect(() => {
    const handleAdminUpdate = () => {
      console.log('🔄 Admin update detected, reloading content...');
      loadContent();
    };

    // Listen for custom event from admin panel
    window.addEventListener('adminContentUpdate', handleAdminUpdate);
    
    return () => {
      window.removeEventListener('adminContentUpdate', handleAdminUpdate);
    };
  }, []);

  // Smooth scroll animation observer
  useEffect(() => {
    if (isAdminPage) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px'
      }
    );

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [location, isAdminPage]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLanguageToggle = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogin = () => {
    // Login handler
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const countries = [
    { code: '+93', name: 'Afghanistan', nameAr: 'أفغانستان', flag: '🇦🇫', iso: 'AF' },
    { code: '+355', name: 'Albania', nameAr: 'ألبانيا', flag: '🇦🇱', iso: 'AL' },
    { code: '+213', name: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿', iso: 'DZ' },
    { code: '+376', name: 'Andorra', nameAr: 'أندورا', flag: '🇦🇩', iso: 'AD' },
    { code: '+244', name: 'Angola', nameAr: 'أنغولا', flag: '🇦🇴', iso: 'AO' },
    { code: '+1268', name: 'Antigua & Barbuda', nameAr: 'أنتيغوا وبربودا', flag: '🇦🇬', iso: 'AG' },
    { code: '+54', name: 'Argentina', nameAr: 'الأرجنتين', flag: '🇦🇷', iso: 'AR' },
    { code: '+374', name: 'Armenia', nameAr: 'أرمينيا', flag: '🇦🇲', iso: 'AM' },
    { code: '+61', name: 'Australia', nameAr: 'أستراليا', flag: '🇦🇺', iso: 'AU' },
    { code: '+43', name: 'Austria', nameAr: 'النمسا', flag: '🇦🇹', iso: 'AT' },
    { code: '+994', name: 'Azerbaijan', nameAr: 'أذربيجان', flag: '🇦🇿', iso: 'AZ' },
    { code: '+1242', name: 'Bahamas', nameAr: 'الباهاما', flag: '🇧🇸', iso: 'BS' },
    { code: '+973', name: 'Bahrain', nameAr: 'البحرين', flag: '🇧🇭', iso: 'BH' },
    { code: '+880', name: 'Bangladesh', nameAr: 'بنغلاديش', flag: '🇧🇩', iso: 'BD' },
    { code: '+1246', name: 'Barbados', nameAr: 'بربادوس', flag: '🇧🇧', iso: 'BB' },
    { code: '+375', name: 'Belarus', nameAr: 'بيلاروسيا', flag: '🇧🇾', iso: 'BY' },
    { code: '+32', name: 'Belgium', nameAr: 'بلجيكا', flag: '🇧🇪', iso: 'BE' },
    { code: '+501', name: 'Belize', nameAr: 'بليز', flag: '🇧🇿', iso: 'BZ' },
    { code: '+229', name: 'Benin', nameAr: 'بنين', flag: '🇧🇯', iso: 'BJ' },
    { code: '+975', name: 'Bhutan', nameAr: 'بوتان', flag: '🇧🇹', iso: 'BT' },
    { code: '+591', name: 'Bolivia', nameAr: 'بوليفيا', flag: '🇧🇴', iso: 'BO' },
    { code: '+387', name: 'Bosnia & Herzegovina', nameAr: 'البوسنة والهرسك', flag: '🇧🇦', iso: 'BA' },
    { code: '+267', name: 'Botswana', nameAr: 'بوتسوانا', flag: '🇧🇼', iso: 'BW' },
    { code: '+55', name: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷', iso: 'BR' },
    { code: '+673', name: 'Brunei', nameAr: 'بروناي', flag: '🇧🇳', iso: 'BN' },
    { code: '+359', name: 'Bulgaria', nameAr: 'بلغاريا', flag: '🇧🇬', iso: 'BG' },
    { code: '+226', name: 'Burkina Faso', nameAr: 'بوركينا فاسو', flag: '🇧🇫', iso: 'BF' },
    { code: '+257', name: 'Burundi', nameAr: 'بوروندي', flag: '🇧🇮', iso: 'BI' },
    { code: '+855', name: 'Cambodia', nameAr: 'كمبوديا', flag: '🇰🇭', iso: 'KH' },
    { code: '+237', name: 'Cameroon', nameAr: 'الكاميرون', flag: '🇨🇲', iso: 'CM' },
    { code: '+1', name: 'Canada', nameAr: 'كندا', flag: '🇨🇦', iso: 'CA' },
    { code: '+238', name: 'Cape Verde', nameAr: 'الرأس الأخضر', flag: '🇨🇻', iso: 'CV' },
    { code: '+236', name: 'Central African Republic', nameAr: 'أفريقيا الوسطى', flag: '🇨🇫', iso: 'CF' },
    { code: '+235', name: 'Chad', nameAr: 'تشاد', flag: '🇹🇩', iso: 'TD' },
    { code: '+56', name: 'Chile', nameAr: 'تشيلي', flag: '🇨🇱', iso: 'CL' },
    { code: '+86', name: 'China', nameAr: 'الصين', flag: '🇨🇳', iso: 'CN' },
    { code: '+57', name: 'Colombia', nameAr: 'كولومبيا', flag: '🇨🇴', iso: 'CO' },
    { code: '+269', name: 'Comoros', nameAr: 'جزر القمر', flag: '🇰🇲', iso: 'KM' },
    { code: '+242', name: 'Congo', nameAr: 'الكونغو', flag: '🇨🇬', iso: 'CG' },
    { code: '+243', name: 'Congo (DRC)', nameAr: 'الكونغو الديمقراطية', flag: '🇨🇩', iso: 'CD' },
    { code: '+506', name: 'Costa Rica', nameAr: 'كوستاريكا', flag: '🇨🇷', iso: 'CR' },
    { code: '+385', name: 'Croatia', nameAr: 'كرواتيا', flag: '🇭🇷', iso: 'HR' },
    { code: '+53', name: 'Cuba', nameAr: 'كوبا', flag: '🇨🇺', iso: 'CU' },
    { code: '+357', name: 'Cyprus', nameAr: 'قبرص', flag: '🇨🇾', iso: 'CY' },
    { code: '+420', name: 'Czech Republic', nameAr: 'التشيك', flag: '🇨🇿', iso: 'CZ' },
    { code: '+45', name: 'Denmark', nameAr: 'الدنمارك', flag: '🇩🇰', iso: 'DK' },
    { code: '+253', name: 'Djibouti', nameAr: 'جيبوتي', flag: '🇩🇯', iso: 'DJ' },
    { code: '+1767', name: 'Dominica', nameAr: 'دومينيكا', flag: '🇩🇲', iso: 'DM' },
    { code: '+1809', name: 'Dominican Republic', nameAr: 'جمهورية الدومينيكان', flag: '🇩🇴', iso: 'DO' },
    { code: '+670', name: 'East Timor', nameAr: 'تيمور الشرقية', flag: '🇹🇱', iso: 'TL' },
    { code: '+593', name: 'Ecuador', nameAr: 'الإكوادور', flag: '🇪🇨', iso: 'EC' },
    { code: '+20', name: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', iso: 'EG' },
    { code: '+503', name: 'El Salvador', nameAr: 'السلفادور', flag: '🇸🇻', iso: 'SV' },
    { code: '+240', name: 'Equatorial Guinea', nameAr: 'غينيا الاستوائية', flag: '🇬🇶', iso: 'GQ' },
    { code: '+291', name: 'Eritrea', nameAr: 'إريتريا', flag: '🇪🇷', iso: 'ER' },
    { code: '+372', name: 'Estonia', nameAr: 'إستونيا', flag: '🇪🇪', iso: 'EE' },
    { code: '+268', name: 'Eswatini', nameAr: 'إسواتيني', flag: '🇸🇿', iso: 'SZ' },
    { code: '+251', name: 'Ethiopia', nameAr: 'إثيوبيا', flag: '🇪🇹', iso: 'ET' },
    { code: '+679', name: 'Fiji', nameAr: 'فيجي', flag: '🇫🇯', iso: 'FJ' },
    { code: '+358', name: 'Finland', nameAr: 'فنلندا', flag: '🇫🇮', iso: 'FI' },
    { code: '+33', name: 'France', nameAr: 'فرنسا', flag: '🇫🇷', iso: 'FR' },
    { code: '+241', name: 'Gabon', nameAr: 'الغابون', flag: '🇬🇦', iso: 'GA' },
    { code: '+220', name: 'Gambia', nameAr: 'غامبيا', flag: '🇬🇲', iso: 'GM' },
    { code: '+995', name: 'Georgia', nameAr: 'جورجيا', flag: '🇬🇪', iso: 'GE' },
    { code: '+49', name: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪', iso: 'DE' },
    { code: '+233', name: 'Ghana', nameAr: 'غانا', flag: '🇬🇭', iso: 'GH' },
    { code: '+30', name: 'Greece', nameAr: 'اليونان', flag: '🇬🇷', iso: 'GR' },
    { code: '+1473', name: 'Grenada', nameAr: 'غرينادا', flag: '🇬🇩', iso: 'GD' },
    { code: '+502', name: 'Guatemala', nameAr: 'غواتيمالا', flag: '🇬🇹', iso: 'GT' },
    { code: '+224', name: 'Guinea', nameAr: 'غينيا', flag: '🇬🇳', iso: 'GN' },
    { code: '+245', name: 'Guinea-Bissau', nameAr: 'غينيا بيساو', flag: '🇬🇼', iso: 'GW' },
    { code: '+592', name: 'Guyana', nameAr: 'غيانا', flag: '🇬🇾', iso: 'GY' },
    { code: '+509', name: 'Haiti', nameAr: 'هايتي', flag: '🇭🇹', iso: 'HT' },
    { code: '+504', name: 'Honduras', nameAr: 'هندوراس', flag: '🇭🇳', iso: 'HN' },
    { code: '+852', name: 'Hong Kong', nameAr: 'هونغ كونغ', flag: '🇭🇰', iso: 'HK' },
    { code: '+36', name: 'Hungary', nameAr: 'المجر', flag: '🇭🇺', iso: 'HU' },
    { code: '+354', name: 'Iceland', nameAr: 'آيسلندا', flag: '🇮🇸', iso: 'IS' },
    { code: '+91', name: 'India', nameAr: 'الهند', flag: '🇮🇳', iso: 'IN' },
    { code: '+62', name: 'Indonesia', nameAr: 'إندونيسيا', flag: '🇮🇩', iso: 'ID' },
    { code: '+98', name: 'Iran', nameAr: 'إيران', flag: '🇮🇷', iso: 'IR' },
    { code: '+964', name: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', iso: 'IQ' },
    { code: '+353', name: 'Ireland', nameAr: 'أيرلندا', flag: '🇮🇪', iso: 'IE' },
    { code: '+39', name: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹', iso: 'IT' },
    { code: '+225', name: 'Ivory Coast', nameAr: 'ساحل العاج', flag: '🇨🇮', iso: 'CI' },
    { code: '+1876', name: 'Jamaica', nameAr: 'جامايكا', flag: '🇯🇲', iso: 'JM' },
    { code: '+81', name: 'Japan', nameAr: 'اليابان', flag: '🇯🇵', iso: 'JP' },
    { code: '+962', name: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', iso: 'JO' },
    { code: '+7', name: 'Kazakhstan', nameAr: 'كازاخستان', flag: '🇰🇿', iso: 'KZ' },
    { code: '+254', name: 'Kenya', nameAr: 'كينيا', flag: '🇰🇪', iso: 'KE' },
    { code: '+686', name: 'Kiribati', nameAr: 'كيريباتي', flag: '🇰🇮', iso: 'KI' },
    { code: '+965', name: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', iso: 'KW' },
    { code: '+996', name: 'Kyrgyzstan', nameAr: 'قيرغيزستان', flag: '🇰🇬', iso: 'KG' },
    { code: '+856', name: 'Laos', nameAr: 'لاوس', flag: '🇱🇦', iso: 'LA' },
    { code: '+371', name: 'Latvia', nameAr: 'لاتفيا', flag: '🇱🇻', iso: 'LV' },
    { code: '+961', name: 'Lebanon', nameAr: 'لبنان', flag: '🇱🇧', iso: 'LB' },
    { code: '+266', name: 'Lesotho', nameAr: 'ليسوتو', flag: '🇱🇸', iso: 'LS' },
    { code: '+231', name: 'Liberia', nameAr: 'ليبيريا', flag: '🇱🇷', iso: 'LR' },
    { code: '+218', name: 'Libya', nameAr: 'ليبيا', flag: '🇱🇾', iso: 'LY' },
    { code: '+423', name: 'Liechtenstein', nameAr: 'ليختنشتاين', flag: '🇱🇮', iso: 'LI' },
    { code: '+370', name: 'Lithuania', nameAr: 'ليتوانيا', flag: '🇱🇹', iso: 'LT' },
    { code: '+352', name: 'Luxembourg', nameAr: 'لوكسمبورغ', flag: '🇱🇺', iso: 'LU' },
    { code: '+853', name: 'Macau', nameAr: 'ماكاو', flag: '🇲🇴', iso: 'MO' },
    { code: '+261', name: 'Madagascar', nameAr: 'مدغشقر', flag: '🇲🇬', iso: 'MG' },
    { code: '+265', name: 'Malawi', nameAr: 'مالاوي', flag: '🇲🇼', iso: 'MW' },
    { code: '+60', name: 'Malaysia', nameAr: 'ماليزيا', flag: '🇲🇾', iso: 'MY' },
    { code: '+960', name: 'Maldives', nameAr: 'المالديف', flag: '🇲🇻', iso: 'MV' },
    { code: '+223', name: 'Mali', nameAr: 'مالي', flag: '🇲🇱', iso: 'ML' },
    { code: '+356', name: 'Malta', nameAr: 'مالطا', flag: '🇲🇹', iso: 'MT' },
    { code: '+222', name: 'Mauritania', nameAr: 'موريتانيا', flag: '🇲🇷', iso: 'MR' },
    { code: '+230', name: 'Mauritius', nameAr: 'موريشيوس', flag: '🇲🇺', iso: 'MU' },
    { code: '+52', name: 'Mexico', nameAr: 'المكسيك', flag: '🇲🇽', iso: 'MX' },
    { code: '+373', name: 'Moldova', nameAr: 'مولدوفا', flag: '🇲🇩', iso: 'MD' },
    { code: '+377', name: 'Monaco', nameAr: 'موناكو', flag: '🇲🇨', iso: 'MC' },
    { code: '+976', name: 'Mongolia', nameAr: 'منغوليا', flag: '🇲🇳', iso: 'MN' },
    { code: '+382', name: 'Montenegro', nameAr: 'الجبل الأسود', flag: '🇲🇪', iso: 'ME' },
    { code: '+212', name: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦', iso: 'MA' },
    { code: '+258', name: 'Mozambique', nameAr: 'موزمبيق', flag: '🇲🇿', iso: 'MZ' },
    { code: '+95', name: 'Myanmar', nameAr: 'ميانمار', flag: '🇲🇲', iso: 'MM' },
    { code: '+264', name: 'Namibia', nameAr: 'ناميبيا', flag: '🇳🇦', iso: 'NA' },
    { code: '+674', name: 'Nauru', nameAr: 'ناورو', flag: '🇳🇷', iso: 'NR' },
    { code: '+977', name: 'Nepal', nameAr: 'نيبال', flag: '🇳🇵', iso: 'NP' },
    { code: '+31', name: 'Netherlands', nameAr: 'هولندا', flag: '🇳🇱', iso: 'NL' },
    { code: '+64', name: 'New Zealand', nameAr: 'نيوزيلندا', flag: '🇳🇿', iso: 'NZ' },
    { code: '+505', name: 'Nicaragua', nameAr: 'نيكاراغوا', flag: '🇳🇮', iso: 'NI' },
    { code: '+227', name: 'Niger', nameAr: 'النيجر', flag: '🇳🇪', iso: 'NE' },
    { code: '+234', name: 'Nigeria', nameAr: 'نيجيريا', flag: '🇳🇬', iso: 'NG' },
    { code: '+850', name: 'North Korea', nameAr: 'كوريا الشمالية', flag: '🇰🇵', iso: 'KP' },
    { code: '+389', name: 'North Macedonia', nameAr: 'مقدونيا الشمالية', flag: '🇲🇰', iso: 'MK' },
    { code: '+47', name: 'Norway', nameAr: 'النرويج', flag: '🇳🇴', iso: 'NO' },
    { code: '+968', name: 'Oman', nameAr: 'عمان', flag: '🇴🇲', iso: 'OM' },
    { code: '+92', name: 'Pakistan', nameAr: 'باكستان', flag: '🇵🇰', iso: 'PK' },
    { code: '+680', name: 'Palau', nameAr: 'بالاو', flag: '🇵🇼', iso: 'PW' },
    { code: '+970', name: 'Palestine', nameAr: 'فلسطين', flag: '🇵🇸', iso: 'PS' },
    { code: '+507', name: 'Panama', nameAr: 'بنما', flag: '🇵🇦', iso: 'PA' },
    { code: '+675', name: 'Papua New Guinea', nameAr: 'بابوا غينيا الجديدة', flag: '🇵🇬', iso: 'PG' },
    { code: '+595', name: 'Paraguay', nameAr: 'باراغواي', flag: '🇵🇾', iso: 'PY' },
    { code: '+51', name: 'Peru', nameAr: 'بيرو', flag: '🇵🇪', iso: 'PE' },
    { code: '+63', name: 'Philippines', nameAr: 'الفلبين', flag: '🇵🇭', iso: 'PH' },
    { code: '+48', name: 'Poland', nameAr: 'بولندا', flag: '🇵🇱', iso: 'PL' },
    { code: '+351', name: 'Portugal', nameAr: 'البرتغال', flag: '🇵🇹', iso: 'PT' },
    { code: '+974', name: 'Qatar', nameAr: 'قطر', flag: '🇶🇦', iso: 'QA' },
    { code: '+40', name: 'Romania', nameAr: 'رومانيا', flag: '🇷🇴', iso: 'RO' },
    { code: '+7', name: 'Russia', nameAr: 'روسيا', flag: '🇷🇺', iso: 'RU' },
    { code: '+250', name: 'Rwanda', nameAr: 'رواندا', flag: '🇷🇼', iso: 'RW' },
    { code: '+1869', name: 'Saint Kitts & Nevis', nameAr: 'سانت كيتس ونيفيس', flag: '🇰🇳', iso: 'KN' },
    { code: '+1758', name: 'Saint Lucia', nameAr: 'سانت لوسيا', flag: '🇱🇨', iso: 'LC' },
    { code: '+1784', name: 'Saint Vincent', nameAr: 'سانت فنسنت', flag: '🇻🇨', iso: 'VC' },
    { code: '+685', name: 'Samoa', nameAr: 'ساموا', flag: '🇼🇸', iso: 'WS' },
    { code: '+378', name: 'San Marino', nameAr: 'سان مارينو', flag: '🇸🇲', iso: 'SM' },
    { code: '+239', name: 'São Tomé & Príncipe', nameAr: 'ساو تومي وبرينسيب', flag: '🇸🇹', iso: 'ST' },
    { code: '+966', name: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', iso: 'SA' },
    { code: '+221', name: 'Senegal', nameAr: 'السنغال', flag: '🇸🇳', iso: 'SN' },
    { code: '+381', name: 'Serbia', nameAr: 'صربيا', flag: '🇷🇸', iso: 'RS' },
    { code: '+248', name: 'Seychelles', nameAr: 'سيشل', flag: '🇸🇨', iso: 'SC' },
    { code: '+232', name: 'Sierra Leone', nameAr: 'سيراليون', flag: '🇸🇱', iso: 'SL' },
    { code: '+65', name: 'Singapore', nameAr: 'سنغافورة', flag: '🇸🇬', iso: 'SG' },
    { code: '+421', name: 'Slovakia', nameAr: 'سلوفاكيا', flag: '🇸🇰', iso: 'SK' },
    { code: '+386', name: 'Slovenia', nameAr: 'سلوفينيا', flag: '🇸🇮', iso: 'SI' },
    { code: '+677', name: 'Solomon Islands', nameAr: 'جزر سليمان', flag: '🇸🇧', iso: 'SB' },
    { code: '+252', name: 'Somalia', nameAr: 'الصومال', flag: '🇸🇴', iso: 'SO' },
    { code: '+27', name: 'South Africa', nameAr: 'جنوب أفريقيا', flag: '🇿🇦', iso: 'ZA' },
    { code: '+82', name: 'South Korea', nameAr: 'كوريا الجنوبية', flag: '🇰🇷', iso: 'KR' },
    { code: '+211', name: 'South Sudan', nameAr: 'جنوب السودان', flag: '🇸🇸', iso: 'SS' },
    { code: '+34', name: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸', iso: 'ES' },
    { code: '+94', name: 'Sri Lanka', nameAr: 'سريلانكا', flag: '🇱🇰', iso: 'LK' },
    { code: '+249', name: 'Sudan', nameAr: 'السودان', flag: '🇸🇩', iso: 'SD' },
    { code: '+597', name: 'Suriname', nameAr: 'سورينام', flag: '🇸🇷', iso: 'SR' },
    { code: '+46', name: 'Sweden', nameAr: 'السويد', flag: '🇸🇪', iso: 'SE' },
    { code: '+41', name: 'Switzerland', nameAr: 'سويسرا', flag: '🇨🇭', iso: 'CH' },
    { code: '+963', name: 'Syria', nameAr: 'سوريا', flag: '🇸🇾', iso: 'SY' },
    { code: '+886', name: 'Taiwan', nameAr: 'تايوان', flag: '🇹🇼', iso: 'TW' },
    { code: '+992', name: 'Tajikistan', nameAr: 'طاجيكستان', flag: '🇹🇯', iso: 'TJ' },
    { code: '+255', name: 'Tanzania', nameAr: 'تنزانيا', flag: '🇹🇿', iso: 'TZ' },
    { code: '+66', name: 'Thailand', nameAr: 'تايلاند', flag: '🇹🇭', iso: 'TH' },
    { code: '+228', name: 'Togo', nameAr: 'توغو', flag: '🇹🇬', iso: 'TG' },
    { code: '+676', name: 'Tonga', nameAr: 'تونغا', flag: '🇹🇴', iso: 'TO' },
    { code: '+1868', name: 'Trinidad & Tobago', nameAr: 'ترينيداد وتوباغو', flag: '🇹🇹', iso: 'TT' },
    { code: '+216', name: 'Tunisia', nameAr: 'تونس', flag: '🇹🇳', iso: 'TN' },
    { code: '+90', name: 'Turkey', nameAr: 'تركيا', flag: '🇹🇷', iso: 'TR' },
    { code: '+993', name: 'Turkmenistan', nameAr: 'تركمانستان', flag: '🇹🇲', iso: 'TM' },
    { code: '+688', name: 'Tuvalu', nameAr: 'توفالو', flag: '🇹🇻', iso: 'TV' },
    { code: '+256', name: 'Uganda', nameAr: 'أوغندا', flag: '🇺🇬', iso: 'UG' },
    { code: '+380', name: 'Ukraine', nameAr: 'أوكرانيا', flag: '🇺🇦', iso: 'UA' },
    { code: '+971', name: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', iso: 'AE' },
    { code: '+44', name: 'United Kingdom', nameAr: 'بريطانيا', flag: '🇬🇧', iso: 'GB' },
    { code: '+1', name: 'United States', nameAr: 'أمريكا', flag: '🇺🇸', iso: 'US' },
    { code: '+598', name: 'Uruguay', nameAr: 'أوروغواي', flag: '🇺🇾', iso: 'UY' },
    { code: '+998', name: 'Uzbekistan', nameAr: 'أوزبكستان', flag: '🇺🇿', iso: 'UZ' },
    { code: '+678', name: 'Vanuatu', nameAr: 'فانواتو', flag: '🇻🇺', iso: 'VU' },
    { code: '+379', name: 'Vatican City', nameAr: 'الفاتيكان', flag: '🇻🇦', iso: 'VA' },
    { code: '+58', name: 'Venezuela', nameAr: 'فنزويلا', flag: '🇻🇪', iso: 'VE' },
    { code: '+84', name: 'Vietnam', nameAr: 'فيتنام', flag: '🇻🇳', iso: 'VN' },
    { code: '+967', name: 'Yemen', nameAr: 'اليمن', flag: '🇾🇪', iso: 'YE' },
    { code: '+260', name: 'Zambia', nameAr: 'زامبيا', flag: '🇿🇲', iso: 'ZM' },
    { code: '+263', name: 'Zimbabwe', nameAr: 'زيمبابوي', flag: '🇿🇼', iso: 'ZW' },
  ];

  // Get dynamic content
  const content = {
    ar: getContent('ar')(dynamicContent),
    en: getContent('en')(dynamicContent)
  };

  const t = content[language];
  const isRTL = language === 'ar';

  // Don't render navbar/footer on admin pages
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    );
  }

  return (
    <div className="App" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                <img
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="MKPRIME"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span>MKPRIME</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="nav-links desktop-nav">
              {isRTL ? (
                <>
                  <Link to="/">{t.nav.home}</Link>
                  <Link to="/services">{t.nav.services}</Link>
                  <Link to="/careers">{t.nav.careers}</Link>
                  <Link to="/contact">{t.nav.contact}</Link>
                </>
              ) : (
                <>
                  <Link to="/">{t.nav.home}</Link>
                  <Link to="/services">{t.nav.services}</Link>
                  <Link to="/careers">{t.nav.careers}</Link>
                  <Link to="/contact">{t.nav.contact}</Link>
                </>
              )}
            </div>
            
            {/* Desktop Language Toggle */}
            <button className="lang-toggle desktop-lang" onClick={handleLanguageToggle}>
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Hamburger Menu Button (Mobile Only) */}
            <button 
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Menu Header */}
        <div className="mobile-menu-header">
          <h3 className="mobile-menu-title">{language === 'ar' ? 'القائمة' : 'Menu'}</h3>
        </div>
        
        <div className="mobile-nav-links">
          {isRTL ? (
            <>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.home}</Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.services}</Link>
              <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.careers}</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.contact}</Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.home}</Link>
              <Link to="/services" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.services}</Link>
              <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.careers}</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.contact}</Link>
            </>
          )}
          
          {/* Language Toggle Inside Mobile Menu */}
          <button className="lang-toggle mobile-lang" onClick={handleLanguageToggle}>
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      {/* Routes - Always render, don't wait for content loading */}
      <Routes>
        <Route path="/" element={<Home language={language} content={content} />} />
        <Route path="/services" element={<Services language={language} content={content} />} />
        <Route path="/careers" element={<Careers language={language} content={content} />} />
        <Route path="/apply" element={<JobApplication language={language} content={content} countries={countries} />} />
        <Route path="/partners" element={<Partners language={language} content={{...content, partners: dynamicContent.partners}} />} />
        <Route path="/contact" element={<Contact language={language} content={content} countries={countries} />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>{t.footer.tagline}</p>
          <p>{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router basename="/">
      <AppContent />
    </Router>
  );
}


export default App;
