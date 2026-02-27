import { getContent as getFirebaseContent } from './firebaseHelpers';

// In-memory cache for content
let contentCache = null;

// Default content constants
export const DEFAULT_CAREERS = [
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

export const DEFAULT_SERVICES = [
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
    imageUrl: '/quality-education.jpg'
  }
];

export const DEFAULT_ABOUT = {
  descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
  descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
  founded: '2023',
  team: '10-50',
  type: 'Digital Company',
  typeAr: 'شركة رقمية'
};

export const DEFAULT_HERO = {
  titleEn: 'Empowering Students Across EA & GCC',
  titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
  subtitleEn: 'Specialized services designed to support your academic journey',
  subtitleAr: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية'
};

export const DEFAULT_PARTNERS = [
  { id: 1, nameEn: 'MK Elite', nameAr: 'MK Elite', logoPath: 'partner 1.jpeg', order: 1 },
  { id: 2, nameEn: 'ALQAWASMI', nameAr: 'ALQAWASMI', logoPath: 'Partener 2.png', order: 2 },
  { id: 3, nameEn: 'Management & Science University', nameAr: 'Management & Science University', logoPath: 'parnter 3.jpeg', order: 3 },
  { id: 4, nameEn: 'UCSI University', nameAr: 'UCSI University', logoPath: 'parnter 4.jpeg', order: 4 },
  { id: 5, nameEn: 'Duy Tân University', nameAr: 'Duy Tân University', logoPath: 'partener 5.jpeg', order: 5 }
];

// Load dynamic content from Firebase
const loadDynamicContentFromFirebase = async () => {
  // Return cached content if available
  if (contentCache) {
    return contentCache;
  }

  try {
    // Load all content types in parallel
    const [careersData, aboutData, servicesData, heroData, partnersData] = await Promise.all([
      getFirebaseContent('careers'),
      getFirebaseContent('aboutInfo'),
      getFirebaseContent('services'),
      getFirebaseContent('heroContent'),
      getFirebaseContent('partners')
    ]);

    // Validate and build content object with defaults as fallback
    const content = {
      careers: validateCareers(careersData),
      aboutInfo: validateAboutInfo(aboutData),
      services: validateServices(servicesData),
      heroContent: validateHeroContent(heroData),
      partners: validatePartners(partnersData)
    };

    // Cache the content
    contentCache = content;
    
    return content;
  } catch (error) {
    console.error('Error loading content from Firebase:', error);
    console.warn('Using default content due to Firebase error');
    
    // Return all defaults on error (don't cache errors)
    return {
      careers: DEFAULT_CAREERS,
      aboutInfo: DEFAULT_ABOUT,
      services: DEFAULT_SERVICES,
      heroContent: DEFAULT_HERO,
      partners: DEFAULT_PARTNERS
    };
  }
};

// Validation functions
const validateCareers = (data) => {
  if (!data || !Array.isArray(data.jobs)) {
    console.warn('Invalid careers data, using defaults');
    return DEFAULT_CAREERS;
  }
  return data.jobs;
};

const validateAboutInfo = (data) => {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid about info data, using defaults');
    return DEFAULT_ABOUT;
  }
  // Merge with defaults to fill any missing fields
  return { ...DEFAULT_ABOUT, ...data };
};

const validateServices = (data) => {
  if (!data || !Array.isArray(data.services)) {
    console.warn('Invalid services data, using defaults');
    return DEFAULT_SERVICES;
  }
  return data.services;
};

const validateHeroContent = (data) => {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid hero content data, using defaults');
    return DEFAULT_HERO;
  }
  // Merge with defaults to fill any missing fields
  return { ...DEFAULT_HERO, ...data };
};

const validatePartners = (data) => {
  if (!data || !Array.isArray(data.partners)) {
    console.warn('Invalid partners data, using defaults');
    return DEFAULT_PARTNERS;
  }
  return data.partners;
};

export const getContent = async (language) => {
  const dynamic = await loadDynamicContentFromFirebase();
  
  const content = {
    ar: {
      nav: {
        home: 'الرئيسية',
        about: 'من نحن',
        services: 'خدماتنا',
        careers: 'الوظائف',
        partners: 'شركاؤنا',
        contact: 'اتصل بنا'
      },
      hero: {
        title: dynamic.heroContent.titleAr || 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
        subtitle: dynamic.heroContent.subtitleAr || 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية',
        cta: 'تواصل معنا'
      },
      about: {
        title: 'من نحن',
        description: dynamic.aboutInfo.descAr || 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
        founded: `تأسست في ${dynamic.aboutInfo.founded || '2023'}`,
        team: `${dynamic.aboutInfo.team || '10-50'} موظف`,
        type: dynamic.aboutInfo.typeAr || 'شركة رقمية'
      },
      services: {
        title: 'خدماتنا',
        service1: {
          title: dynamic.services[0]?.titleAr || 'الدعم الأكاديمي',
          desc: dynamic.services[0]?.descAr || 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم'
        },
        service2: {
          title: dynamic.services[1]?.titleAr || 'الاستشارات التعليمية',
          desc: dynamic.services[1]?.descAr || 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي'
        },
        service3: {
          title: dynamic.services[2]?.titleAr || 'حلول التكنولوجيا التعليمية',
          desc: dynamic.services[2]?.descAr || 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي'
        },
        service4: {
          title: dynamic.services[3]?.titleAr || 'برامج تعليمية عالية الجودة',
          desc: dynamic.services[3]?.descAr || 'نقدم برامج ذات جودة تعليمية عالية ونظام تعلم قوي'
        }
      },
      careers: {
        title: 'الوظائف',
        intro: 'انضم إلى فريقنا وساعدنا في تمكين الطلاب في جميع أنحاء شرق آسيا ودول مجلس التعاون الخليجي',
        jobs: dynamic.careers.map(career => ({
          title: career.titleAr,
          type: career.typeAr,
          description: career.descAr
        })),
        apply: 'تقدم الآن'
      },
      partners: {
        title: 'شركاؤنا',
        intro: 'نفخر بالشراكة مع المؤسسات الرائدة لتقديم أفضل الخدمات لطلابنا'
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
        about: 'About',
        services: 'Services',
        careers: 'Careers',
        partners: 'Partners',
        contact: 'Contact'
      },
      hero: {
        title: dynamic.heroContent.titleEn || 'Empowering Students Across EA & GCC',
        subtitle: dynamic.heroContent.subtitleEn || 'Specialized services designed to support your academic journey',
        cta: 'Get in Touch'
      },
      about: {
        title: 'About Us',
        description: dynamic.aboutInfo.descEn || 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
        founded: `Founded in ${dynamic.aboutInfo.founded || '2023'}`,
        team: `${dynamic.aboutInfo.team || '10-50'} Employees`,
        type: dynamic.aboutInfo.type || 'Digital Company'
      },
      services: {
        title: 'Our Services',
        service1: {
          title: dynamic.services[0]?.titleEn || 'Academic Support',
          desc: dynamic.services[0]?.descEn || 'Comprehensive support to help students excel in their studies'
        },
        service2: {
          title: dynamic.services[1]?.titleEn || 'Educational Consulting',
          desc: dynamic.services[1]?.descEn || 'Expert guidance for academic planning and career development'
        },
        service3: {
          title: dynamic.services[2]?.titleEn || 'Edu Technology Solutions',
          desc: dynamic.services[2]?.descEn || 'Innovative tech tools and resources for academic success'
        },
        service4: {
          title: dynamic.services[3]?.titleEn || 'Quality Education Programs',
          desc: dynamic.services[3]?.descEn || 'We offer programs with a high quality of education and a strong learning system'
        }
      },
      careers: {
        title: 'Careers',
        intro: 'Join our team and help us empower students across East Asia and the GCC',
        jobs: dynamic.careers.map(career => ({
          title: career.titleEn,
          type: career.type,
          description: career.descEn
        })),
        apply: 'Apply Now'
      },
      partners: {
        title: 'Our Partners',
        intro: 'We are proud to partner with leading institutions to provide the best services to our students'
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
        contact_title: 'Contact Us',
        follow_title: 'Follow Us'
      },
      footer: {
        rights: '© 2026 MKPRIME. All rights reserved.',
        tagline: 'Optimizing students\' academic success'
      }
    }
  };

  return content[language];
};
