const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db('mkprime');
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('content');

    switch (req.method) {
      case 'GET':
        // Get all content
        const content = await collection.findOne({ _id: 'site-content' });
        if (!content) {
          // Return default content if none exists
          const defaultContent = {
            _id: 'site-content',
            careers: {
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
            },
            services: {
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
            },
            partners: {
              partners: [
                { id: 1, nameEn: 'MK Elite', nameAr: 'MK Elite', logoPath: 'partner 1.jpeg', order: 1 },
                { id: 2, nameEn: 'ALQAWASMI', nameAr: 'ALQAWASMI', logoPath: 'Partener 2.png', order: 2 },
                { id: 3, nameEn: 'Management & Science University', nameAr: 'Management & Science University', logoPath: 'parnter 3.jpeg', order: 3 },
                { id: 4, nameEn: 'UCSI University', nameAr: 'UCSI University', logoPath: 'parnter 4.jpeg', order: 4 },
                { id: 5, nameEn: 'Duy Tân University', nameAr: 'Duy Tân University', logoPath: 'partener 5.jpeg', order: 5 }
              ]
            },
            aboutInfo: {
              descEn: 'MKPRIME is dedicated to providing specialized services designed to support students across East Asia (EA) and the Gulf Cooperation Council (GCC) regions. Our offerings are designed to empower students with solutions, including academic services and support, educational technology solutions, and resources that help students efficiently navigate their academic journeys.',
              descAr: 'نقدّم خدمات مخصصة لدعم الطلاب في الجامعات داخل شرق آسيا والخليج العربي، تشمل: الدعم الأكاديمي - تنظيم الوثائق وإدارتها - حلول تكنولوجيا تعليمية تساعد الطلاب على التكيف والنجاح في بيئة دراستهم. نسعى لتقديم تجربة تعليمية أكثر سلاسة وتنظيماً للطلاب الدوليين.',
              founded: '2023',
              team: '10-50',
              type: 'Digital Company',
              typeAr: 'شركة رقمية'
            },
            heroContent: {
              titleEn: 'Empowering Students Across EA & GCC',
              titleAr: 'نمكّن الطلاب في شرق آسيا ودول مجلس التعاون الخليجي',
              subtitleEn: 'Specialized services designed to support your academic journey',
              subtitleAr: 'نقدم خدمات متخصصة لدعم الطلاب في رحلتهم الأكاديمية'
            },
            lastUpdated: new Date()
          };
          
          await collection.insertOne(defaultContent);
          res.status(200).json(defaultContent);
        } else {
          res.status(200).json(content);
        }
        break;

      case 'POST':
      case 'PUT':
        // Update content
        const { section, data } = req.body;
        
        if (!section || !data) {
          return res.status(400).json({ error: 'Section and data are required' });
        }

        const updateData = {
          [`${section}`]: data,
          lastUpdated: new Date()
        };

        const result = await collection.updateOne(
          { _id: 'site-content' },
          { $set: updateData },
          { upsert: true }
        );

        res.status(200).json({ success: true, result });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
};