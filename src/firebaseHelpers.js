import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Default data
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

const DEFAULT_SERVICES = [
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

const DEFAULT_PARTNERS = [
  { id: 1, nameEn: 'MK Elite', nameAr: 'MK Elite', logoPath: 'partner 1.jpeg', order: 1 },
  { id: 2, nameEn: 'ALQAWASMI', nameAr: 'ALQAWASMI', logoPath: 'Partener 2.png', order: 2 },
  { id: 3, nameEn: 'Management & Science University', nameAr: 'Management & Science University', logoPath: 'parnter 3.jpeg', order: 3 },
  { id: 4, nameEn: 'UCSI University', nameAr: 'UCSI University', logoPath: 'parnter 4.jpeg', order: 4 },
  { id: 5, nameEn: 'Duy Tân University', nameAr: 'Duy Tân University', logoPath: 'partener 5.jpeg', order: 5 }
];

const DEFAULT_ABOUT = {
  descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
  descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
  founded: '2023',
  team: '10-50',
  type: 'Digital Company',
  typeAr: 'شركة رقمية'
};

const DEFAULT_HERO = {
  titleEn: 'Empowering Students Across EA & GCC',
  titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
  subtitleEn: 'Specialized services designed to support your academic journey',
  subtitleAr: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية'
};

// Get content from Firestore
export const getContent = async (contentType) => {
  try {
    const docRef = doc(db, 'content', contentType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default data if document doesn't exist
      switch (contentType) {
        case 'careers':
          return { jobs: DEFAULT_CAREERS };
        case 'services':
          return { services: DEFAULT_SERVICES };
        case 'partners':
          return { partners: DEFAULT_PARTNERS };
        case 'aboutInfo':
          return DEFAULT_ABOUT;
        case 'heroContent':
          return DEFAULT_HERO;
        default:
          return null;
      }
    }
  } catch (error) {
    console.error('Error getting content:', error);
    // Return default data on error
    switch (contentType) {
      case 'careers':
        return { jobs: DEFAULT_CAREERS };
      case 'services':
        return { services: DEFAULT_SERVICES };
      case 'partners':
        return { partners: DEFAULT_PARTNERS };
      case 'aboutInfo':
        return DEFAULT_ABOUT;
      case 'heroContent':
        return DEFAULT_HERO;
      default:
        return null;
    }
  }
};

// Save content to Firestore
export const saveContent = async (contentType, data) => {
  try {
    const docRef = doc(db, 'content', contentType);
    await setDoc(docRef, data);
    console.log(`${contentType} saved successfully`);
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    return false;
  }
};

// Listen to real-time updates
export const subscribeToContent = (contentType, callback) => {
  const docRef = doc(db, 'content', contentType);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      // Return default data if document doesn't exist
      switch (contentType) {
        case 'careers':
          callback({ jobs: DEFAULT_CAREERS });
          break;
        case 'services':
          callback({ services: DEFAULT_SERVICES });
          break;
        case 'partners':
          callback({ partners: DEFAULT_PARTNERS });
          break;
        case 'aboutInfo':
          callback(DEFAULT_ABOUT);
          break;
        case 'heroContent':
          callback(DEFAULT_HERO);
          break;
        default:
          callback(null);
      }
    }
  });
};

// Initialize default content (run once)
export const initializeDefaultContent = async () => {
  try {
    // Check if content already exists, if not, create it
    const contentTypes = ['careers', 'services', 'partners', 'aboutInfo', 'heroContent'];
    
    for (const contentType of contentTypes) {
      const docRef = doc(db, 'content', contentType);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        let defaultData;
        switch (contentType) {
          case 'careers':
            defaultData = { jobs: DEFAULT_CAREERS };
            break;
          case 'services':
            defaultData = { services: DEFAULT_SERVICES };
            break;
          case 'partners':
            defaultData = { partners: DEFAULT_PARTNERS };
            break;
          case 'aboutInfo':
            defaultData = DEFAULT_ABOUT;
            break;
          case 'heroContent':
            defaultData = DEFAULT_HERO;
            break;
          default:
            continue;
        }
        
        await setDoc(docRef, defaultData);
        console.log(`Initialized ${contentType} with default data`);
      }
    }
  } catch (error) {
    console.error('Error initializing default content:', error);
  }
};