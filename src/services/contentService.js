// Content Service - Handles MongoDB operations
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://mkprime1-an1n.vercel.app/api' 
  : '/api';

class ContentService {
  async getAllContent() {
    try {
      const response = await fetch(`${API_BASE}/content`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to localStorage if MongoDB fails
      return this.getLocalStorageFallback();
    }
  }

  async updateContent(section, data) {
    try {
      const response = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Also update localStorage as backup
      localStorage.setItem(section, JSON.stringify(data));
      
      return result;
    } catch (error) {
      console.error('Error updating content:', error);
      // Fallback to localStorage if MongoDB fails
      localStorage.setItem(section, JSON.stringify(data));
      throw error;
    }
  }

  getLocalStorageFallback() {
    // Fallback to localStorage if MongoDB is unavailable
    const careers = localStorage.getItem('careers');
    const aboutInfo = localStorage.getItem('aboutInfo');
    const services = localStorage.getItem('services');
    const heroContent = localStorage.getItem('heroContent');
    const partners = localStorage.getItem('partners');

    const parsedCareers = careers ? JSON.parse(careers) : null;
    const parsedServices = services ? JSON.parse(services) : null;
    const parsedPartners = partners ? JSON.parse(partners) : null;

    return {
      careers: parsedCareers?.jobs ? parsedCareers : { jobs: parsedCareers || [] },
      aboutInfo: aboutInfo ? JSON.parse(aboutInfo) : {},
      services: parsedServices?.services ? parsedServices : { services: parsedServices || [] },
      heroContent: heroContent ? JSON.parse(heroContent) : {},
      partners: parsedPartners?.partners ? parsedPartners : { partners: parsedPartners || [] }
    };
  }

  // Specific methods for each content type
  async getCareers() {
    const content = await this.getAllContent();
    return content.careers || { jobs: [] };
  }

  async updateCareers(jobs) {
    return this.updateContent('careers', { jobs });
  }

  async getServices() {
    const content = await this.getAllContent();
    return content.services || { services: [] };
  }

  async updateServices(services) {
    return this.updateContent('services', { services });
  }

  async getPartners() {
    const content = await this.getAllContent();
    return content.partners || { partners: [] };
  }

  async updatePartners(partners) {
    return this.updateContent('partners', { partners });
  }

  async getAboutInfo() {
    const content = await this.getAllContent();
    return content.aboutInfo || {};
  }

  async updateAboutInfo(aboutInfo) {
    return this.updateContent('aboutInfo', aboutInfo);
  }

  async getHeroContent() {
    const content = await this.getAllContent();
    return content.heroContent || {};
  }

  async updateHeroContent(heroContent) {
    return this.updateContent('heroContent', heroContent);
  }
}

export default new ContentService();