// Test utilities for mocking Firebase and content

export const mockFirebaseSuccess = (contentType, data) => {
  const { getContent } = require('./firebaseHelpers');
  getContent.mockResolvedValue(data);
};

export const mockFirebaseError = (error) => {
  const { getContent } = require('./firebaseHelpers');
  getContent.mockRejectedValue(error);
};

export const mockFirebaseNull = () => {
  const { getContent } = require('./firebaseHelpers');
  getContent.mockResolvedValue(null);
};

export const clearFirebaseMocks = () => {
  jest.clearAllMocks();
};

// Sample test data
export const sampleCareers = {
  jobs: [
    {
      id: 1,
      titleEn: 'Test Position',
      titleAr: 'وظيفة اختبار',
      type: 'Full-time',
      typeAr: 'دوام كامل',
      descEn: 'Test description',
      descAr: 'وصف الاختبار'
    }
  ]
};

export const sampleServices = {
  services: [
    {
      id: 1,
      titleEn: 'Test Service',
      titleAr: 'خدمة اختبار',
      descEn: 'Test description',
      descAr: 'وصف الاختبار',
      imageUrl: 'test.jpg'
    }
  ]
};

export const sampleAboutInfo = {
  descEn: 'Test description',
  descAr: 'وصف الاختبار',
  founded: '2023',
  team: '10-50',
  type: 'Test Company',
  typeAr: 'شركة اختبار'
};

export const sampleHeroContent = {
  titleEn: 'Test Title',
  titleAr: 'عنوان الاختبار',
  subtitleEn: 'Test Subtitle',
  subtitleAr: 'عنوان فرعي للاختبار'
};

export const samplePartners = {
  partners: [
    {
      id: 1,
      nameEn: 'Test Partner',
      nameAr: 'شريك الاختبار',
      logoPath: 'test.jpg',
      order: 1
    }
  ]
};
