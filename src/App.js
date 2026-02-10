import React, { useState, useEffect } from 'react';
import './App.css';
import './animations.css';

function App() {
  const [language, setLanguage] = useState('ar');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+974',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Smooth scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing after animation to prevent re-triggering
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px'
      }
    );

    // Select all elements to animate
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.nameAr.includes(searchTerm) ||
    country.code.includes(searchTerm)
  );

  // Auto-detect user's country
  React.useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        if (data.country_calling_code) {
          setFormData(prev => ({ ...prev, countryCode: data.country_calling_code }));
        }
      })
      .catch(() => {
        // Keep Qatar as default
      });
  }, []);

  const content = {
    ar: {
      nav: {
        home: 'الرئيسية',
        services: 'خدماتنا',
        about: 'من نحن',
        contact: 'اتصل بنا'
      },
      hero: {
        title: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
        subtitle: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية',
        cta: 'تواصل معنا'
      },
      about: {
        title: 'من نحن',
        description: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
        founded: 'تأسست في 2023',
        team: '10-15 موظف',
        type: 'شركة رقمية'
      },
      services: {
        title: 'خدماتنا',
        service1: {
          title: 'الدعم الأكاديمي',
          desc: 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم'
        },
        service2: {
          title: 'الاستشارات التعليمية',
          desc: 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي'
        },
        service3: {
          title: 'حلول التكنولوجيا التعليمية',
          desc: 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي'
        }
      },
      contact: {
        title: 'تواصل معنا',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        message: 'رسالتك',
        send: 'إرسال',
        whatsapp: 'واتساب',
        address: 'الموقع',
        facebook: 'فيسبوك',
        instagram: 'انستغرام',
        subtitle: 'تواصل معنا',
        contact_title: 'اتصل بنا',
        follow_title: 'تابعنا'
      },
      footer: {
        rights: '© 2026 MKPRIME. جميع الحقوق محفوظة.',
      }
    },
    en: {
      nav: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        contact: 'Contact'
      },
      hero: {
        title: 'Empowering Students Across EA & GCC',
        subtitle: 'Specialized services designed to support your academic journey',
        cta: 'Get in Touch'
      },
      about: {
        title: 'About Us',
        description: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
        founded: 'Founded in 2023',
        team: '10-15 Employees',
        type: 'Digital Company'
      },
      services: {
        title: 'Our Services',
        service1: {
          title: 'Academic Support',
          desc: 'Comprehensive support to help students excel in their studies'
        },
        service2: {
          title: 'Educational Consulting',
          desc: 'Expert guidance for academic planning and career development'
        },
        service3: {
          title: 'Edu Technology Solutions',
          desc: 'Innovative tech tools and resources for academic success'
        }
      },
      contact: {
        title: 'Contact Us',
        name: 'Name',
        email: 'Email',
        phone: 'Phone Number',
        message: 'Your Message',
        send: 'Send Message',
        whatsapp: 'WhatsApp',
        address: 'Location',
        facebook: 'Facebook',
        instagram: 'Instagram',
        subtitle: 'Get in touch with us',
        contact_title: 'Contact Us',
        follow_title: 'Follow Us'
      },
      footer: {
        rights: '© 2026 MKPRIME. All rights reserved.',
        tagline: 'Optimizing students\' academic success'
      }
    }
  };

  const t = content[language];
  const isRTL = language === 'ar';

  const handleLanguageToggle = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

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
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          message: formData.message
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', countryCode: '+974', phone: '', message: '' });
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="App" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
                <img src="/logo.png" alt="MKPRIME" />
                <span>MKPRIME</span>
              </a>
            </div>
            <div className="nav-links">
              {isRTL ? (
                <>
                  <a href="#home">{t.nav.home}</a>
                  <a href="#about">{t.nav.about}</a>
                  <a href="#services">{t.nav.services}</a>
                  <a href="#contact">{t.nav.contact}</a>
                </>
              ) : (
                <>
                  <a href="#home">{t.nav.home}</a>
                  <a href="#about">{t.nav.about}</a>
                  <a href="#services">{t.nav.services}</a>
                  <a href="#contact">{t.nav.contact}</a>
                </>
              )}
            </div>
            <button className="lang-toggle" onClick={handleLanguageToggle}>
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t.hero.title}</h1>
            <p>{t.hero.subtitle}</p>
            <a href="#contact" className="cta-button">{t.hero.cta}</a>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" alt="Students studying" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about scroll-animate">
        <div className="container">
          <h2>{t.about.title}</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{t.about.description}</p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-icon">📅</span>
                  <span>{t.about.founded}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">👥</span>
                  <span>{t.about.team}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💼</span>
                  <span>{t.about.type}</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Team collaboration" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services scroll-animate">
        <div className="container">
          <h2>{t.services.title}</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80" alt="Academic support" />
              </div>
              <h3>{t.services.service1.title}</h3>
              <p>{t.services.service1.desc}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80" alt="Consulting" />
              </div>
              <h3>{t.services.service2.title}</h3>
              <p>{t.services.service2.desc}</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80" alt="Technology" />
              </div>
              <h3>{t.services.service3.title}</h3>
              <p>{t.services.service3.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact scroll-animate">
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

export default App;
