import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
}

const defaultSEO = {
  title: 'BMIET - Bhagwan Mahaveer Institute of Engineering & Technology',
  description: 'BMIET is a leading engineering institute offering world-class education in various engineering disciplines. Explore our courses, admissions, and campus life.',
  keywords: 'BMIET, engineering college, technical education, computer science, mechanical engineering, electronics, admissions, placements',
  image: '/og-image.jpg',
  url: 'https://bmiet.edu.in',
  type: 'website' as const,
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | BMIET` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type,
  };

  const structuredDataScript = structuredData ? JSON.stringify(structuredData) : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content="BMIET" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content="BMIET" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seo.url} />
      <meta property="twitter:title" content={seo.title} />
      <meta property="twitter:description" content={seo.description} />
      <meta property="twitter:image" content={seo.image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />

      {/* Structured Data */}
      {structuredDataScript && (
        <script type="application/ld+json">
          {structuredDataScript}
        </script>
      )}
    </Helmet>
  );
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'Home',
    description: 'Welcome to BMIET - A premier engineering institute offering world-class education and excellent placement opportunities.',
    keywords: 'BMIET home, engineering college, technical education, admissions',
  },
  courses: {
    title: 'Courses',
    description: 'Explore our comprehensive range of engineering courses including Computer Science, Mechanical, Electronics, and Civil Engineering.',
    keywords: 'engineering courses, computer science, mechanical engineering, electronics, civil engineering, BMIET courses',
  },
  admissions: {
    title: 'Admissions',
    description: 'Apply to BMIET for the academic year 2024-25. Learn about our admission process, eligibility criteria, and important dates.',
    keywords: 'BMIET admissions, engineering admissions, application process, eligibility criteria',
  },
  news: {
    title: 'News & Events',
    description: 'Stay updated with the latest news, events, and achievements at BMIET. Read about our students, faculty, and campus activities.',
    keywords: 'BMIET news, campus events, student achievements, college news',
  },
  about: {
    title: 'About Us',
    description: 'Learn about BMIET\'s history, mission, vision, and commitment to providing quality engineering education.',
    keywords: 'about BMIET, college history, mission vision, engineering education',
  },
  contact: {
    title: 'Contact Us',
    description: 'Get in touch with BMIET. Find our contact information, location, and office hours.',
    keywords: 'BMIET contact, college address, phone number, email, location',
  },
};

// Structured data for organization
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "BMIET - Bhagwan Mahaveer Institute of Engineering & Technology",
  "url": "https://bmiet.edu.in",
  "logo": "https://bmiet.edu.in/logo.png",
  "description": "A premier engineering institute offering world-class education in various engineering disciplines.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "BMIET Campus",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "123456",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-1234567890",
    "contactType": "Admissions",
    "email": "admissions@bmiet.edu.in"
  },
  "sameAs": [
    "https://facebook.com/bmiet",
    "https://twitter.com/bmiet",
    "https://linkedin.com/school/bmiet"
  ]
};

// Structured data for course
export const createCourseStructuredData = (course: any) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "EducationalOrganization",
    "name": "BMIET",
    "url": "https://bmiet.edu.in"
  },
  "courseMode": "OnSite",
  "educationalLevel": "Undergraduate",
  "timeRequired": `P${course.duration}Y`,
  "offers": {
    "@type": "Offer",
    "price": course.fees,
    "priceCurrency": "INR"
  }
});
