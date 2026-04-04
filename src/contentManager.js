import { getContent as getFirebaseContent } from './firebaseHelpers';

// Content Manager - Loads dynamic content from Firebase with localStorage fallback
export const loadDynamicContent = async () => {
  try {
    // Try to load from Firebase first
    const [careers, aboutInfo, services, heroContent] = await Promise.all([
      getFirebaseContent('careers'),
      getFirebaseContent('aboutInfo'),
      getFirebaseContent('services'),
      getFirebaseContent('heroContent')
    ]);

    return {
      careers: careers?.jobs || [],
      aboutInfo: aboutInfo || {},
      services: services?.services || [],
      heroContent: heroContent || {}
    };
  } catch (error) {
    console.error('Error loading from Firebase, falling back to localStorage:', error);
    
    // Fallback to localStorage
    const careers = localStorage.getItem('careers');
    const aboutInfo = localStorage.getItem('aboutInfo');
    const services = localStorage.getItem('services');
    const heroContent = localStorage.getItem('heroContent');

    const parsedCareers = careers ? JSON.parse(careers) : null;
    const parsedServices = services ? JSON.parse(services) : null;

    return {
      careers: parsedCareers?.jobs || parsedCareers || [],
      aboutInfo: aboutInfo ? JSON.parse(aboutInfo) : {},
      services: parsedServices?.services || parsedServices || [],
      heroContent: heroContent ? JSON.parse(heroContent) : {}
    };
  }
};

export const getContent = async (language) => {
  const dynamic = await loadDynamicContent();
  
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
          title: (Array.isArray(dynamic.services) && dynamic.services[0]) ? dynamic.services[0].titleAr : 'الدعم الأكاديمي',
          desc: (Array.isArray(dynamic.services) && dynamic.services[0]) ? dynamic.services[0].descAr : 'دعم شامل لمساعدة الطلاب على التفوق في دراستهم'
        },
        service2: {
          title: (Array.isArray(dynamic.services) && dynamic.services[1]) ? dynamic.services[1].titleAr : 'الاستشارات التعليمية',
          desc: (Array.isArray(dynamic.services) && dynamic.services[1]) ? dynamic.services[1].descAr : 'إرشادات الخبراء للتخطيط الأكاديمي والتطوير الوظيفي'
        },
        service3: {
          title: (Array.isArray(dynamic.services) && dynamic.services[2]) ? dynamic.services[2].titleAr : 'حلول التكنولوجيا التعليمية',
          desc: (Array.isArray(dynamic.services) && dynamic.services[2]) ? dynamic.services[2].descAr : 'أدوات وموارد تقنية مبتكرة للنجاح الأكاديمي'
        },
        service4: {
          title: (Array.isArray(dynamic.services) && dynamic.services[3]) ? dynamic.services[3].titleAr : 'برامج تعليمية عالية الجودة',
          desc: (Array.isArray(dynamic.services) && dynamic.services[3]) ? dynamic.services[3].descAr : 'نقدم برامج ذات جودة تعليمية عالية ونظام تعلم قوي'
        }
      },
      careers: {
        title: 'الوظائف',
        intro: 'انضم إلى فريقنا وساعدنا في تمكين الطلاب في جميع أنحاء شرق آسيا ودول مجلس التعاون الخليجي',
        jobs: Array.isArray(dynamic.careers) ? dynamic.careers.map(career => ({
          title: career.titleAr,
          type: career.typeAr,
          description: career.descAr
        })) : [],
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
          title: (Array.isArray(dynamic.services) && dynamic.services[0]) ? dynamic.services[0].titleEn : 'Academic Support',
          desc: (Array.isArray(dynamic.services) && dynamic.services[0]) ? dynamic.services[0].descEn : 'Comprehensive support to help students excel in their studies'
        },
        service2: {
          title: (Array.isArray(dynamic.services) && dynamic.services[1]) ? dynamic.services[1].titleEn : 'Educational Consulting',
          desc: (Array.isArray(dynamic.services) && dynamic.services[1]) ? dynamic.services[1].descEn : 'Expert guidance for academic planning and career development'
        },
        service3: {
          title: (Array.isArray(dynamic.services) && dynamic.services[2]) ? dynamic.services[2].titleEn : 'Edu Technology Solutions',
          desc: (Array.isArray(dynamic.services) && dynamic.services[2]) ? dynamic.services[2].descEn : 'Innovative tech tools and resources for academic success'
        },
        service4: {
          title: (Array.isArray(dynamic.services) && dynamic.services[3]) ? dynamic.services[3].titleEn : 'Quality Education Programs',
          desc: (Array.isArray(dynamic.services) && dynamic.services[3]) ? dynamic.services[3].descEn : 'We offer programs with a high quality of education and a strong learning system'
        }
      },
      careers: {
        title: 'Careers',
        intro: 'Join our team and help us empower students across East Asia and the GCC',
        jobs: Array.isArray(dynamic.careers) ? dynamic.careers.map(career => ({
          title: career.titleEn,
          type: career.type,
          description: career.descEn
        })) : [],
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
