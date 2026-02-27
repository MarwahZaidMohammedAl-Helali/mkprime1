// Firebase helper functions for CRUD operations
import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore';

// Content Management
export const getContent = async (contentType) => {
  try {
    const docRef = doc(db, 'content', contentType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting content:', error);
    return null;
  }
};

export const saveContent = async (contentType, data) => {
  try {
    const docRef = doc(db, 'content', contentType);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    return false;
  }
};

// Initialize default content if not exists
export const initializeDefaultContent = async () => {
  try {
    // Check if content exists
    const careersDoc = await getContent('careers');
    
    if (!careersDoc) {
      console.log('Initializing default content in Firebase...');
      
      // Initialize with default data
      await saveContent('careers', {
        jobs: [
          {
            id: 1,
            titleEn: 'Student Coordinator (Remote)',
            titleAr: 'منسق الطلاب (عن بُعد)',
            type: 'Flexible Hours',
            typeAr: 'ساعات مرنة',
            descEn: 'Support students academically and socially while coordinating activities, managing data, and assisting with student engagement.',
            descAr: 'دعم الطلاب أكاديمياً واجتماعياً مع تنسيق الأنشطة وإدارة البيانات والمساعدة في مشاركة الطلاب.'
          }
        ]
      });

      await saveContent('aboutInfo', {
        descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
        descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
        founded: '2023',
        team: '10-50',
        type: 'Digital Company',
        typeAr: 'شركة رقمية'
      });

      await saveContent('services', {
        services: [
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
        ]
      });

      await saveContent('heroContent', {
        titleEn: 'Empowering Students Across EA & GCC',
        titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
        subtitleEn: 'Specialized services designed to support your academic journey',
        subtitleAr: 'خدمات متخصصة لدعم رحلتك الأكاديمية'
      });

      await saveContent('partners', {
        partners: [
          { id: 1, nameEn: 'MK Elite', nameAr: 'MK Elite', logoPath: 'partner 1.jpeg', order: 1 },
          { id: 2, nameEn: 'ALQAWASMI', nameAr: 'ALQAWASMI', logoPath: 'Partener 2.png', order: 2 },
          { id: 3, nameEn: 'Management & Science University', nameAr: 'Management & Science University', logoPath: 'parnter 3.jpeg', order: 3 },
          { id: 4, nameEn: 'UCSI University', nameAr: 'UCSI University', logoPath: 'parnter 4.jpeg', order: 4 },
          { id: 5, nameEn: 'Duy Tân University', nameAr: 'Duy Tân University', logoPath: 'partener 5.jpeg', order: 5 }
        ]
      });

      console.log('Default content initialized in Firebase successfully!');
    } else {
      console.log('Firebase content already exists, skipping initialization');
    }
  } catch (error) {
    console.error('Error initializing default content:', error);
  }
};
