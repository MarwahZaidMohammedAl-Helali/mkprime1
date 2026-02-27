// Integration test for Firebase content loading
import { getContent } from '../contentManager';
import * as firebaseHelpers from '../firebaseHelpers';

// Mock Firebase helpers
jest.mock('../firebaseHelpers');

describe('Content Manager Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the cache by reloading the module
    jest.resetModules();
  });

  test('should load content from Firebase successfully', async () => {
    // Re-import to get fresh module
    const { getContent } = require('../contentManager');
    
    // Mock Firebase responses
    const mockCareers = { jobs: [{ id: 1, titleEn: 'Test Job', titleAr: 'وظيفة اختبار' }] };
    const mockAbout = { descEn: 'Test', descAr: 'اختبار', founded: '2023', team: '10', type: 'Test', typeAr: 'اختبار' };
    const mockServices = { services: [{ id: 1, titleEn: 'Test Service', titleAr: 'خدمة اختبار' }] };
    const mockHero = { titleEn: 'Test', titleAr: 'اختبار', subtitleEn: 'Test', subtitleAr: 'اختبار' };
    const mockPartners = { partners: [{ id: 1, nameEn: 'Test Partner', nameAr: 'شريك اختبار' }] };

    firebaseHelpers.getContent
      .mockResolvedValueOnce(mockCareers)
      .mockResolvedValueOnce(mockAbout)
      .mockResolvedValueOnce(mockServices)
      .mockResolvedValueOnce(mockHero)
      .mockResolvedValueOnce(mockPartners);

    const content = await getContent('en');

    expect(content).toBeDefined();
    expect(content.hero).toBeDefined();
    expect(content.about).toBeDefined();
    expect(content.services).toBeDefined();
    expect(content.careers).toBeDefined();
  });

  test('should use defaults when Firebase returns null', async () => {
    // Re-import to get fresh module
    const { getContent } = require('../contentManager');
    
    firebaseHelpers.getContent.mockResolvedValue(null);

    const content = await getContent('en');

    expect(content).toBeDefined();
    expect(content.hero.title).toContain('Empowering Students');
  });

  test('should handle Firebase errors gracefully', async () => {
    // Re-import to get fresh module
    const { getContent } = require('../contentManager');
    
    firebaseHelpers.getContent.mockRejectedValue(new Error('Firebase error'));

    const content = await getContent('en');

    expect(content).toBeDefined();
    expect(content.hero.title).toContain('Empowering Students');
  });

  test('should cache content after first load', async () => {
    // Re-import to get fresh module
    const { getContent } = require('../contentManager');
    const firebaseHelpers = require('../firebaseHelpers');
    
    const mockCareers = { jobs: [] };
    const mockAbout = { descEn: 'Test' };
    const mockServices = { services: [] };
    const mockHero = { titleEn: 'Test' };
    const mockPartners = { partners: [] };

    firebaseHelpers.getContent
      .mockResolvedValueOnce(mockCareers)
      .mockResolvedValueOnce(mockAbout)
      .mockResolvedValueOnce(mockServices)
      .mockResolvedValueOnce(mockHero)
      .mockResolvedValueOnce(mockPartners);

    // First call
    await getContent('en');
    
    // Second call should use cache
    await getContent('en');

    // Firebase should only be called 5 times (once for each content type)
    expect(firebaseHelpers.getContent).toHaveBeenCalledTimes(5);
  });
});
