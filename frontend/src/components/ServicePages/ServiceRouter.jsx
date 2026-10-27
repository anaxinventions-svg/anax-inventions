// src/components/ServiceRouter/ServiceRouter.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicPage from '../ServicePages/DynamicPage/DynamicPage';

const API_URL = 'http://localhost:5001/api';

// ✅ SLUG MAPPING (Navbar slug to page slug)
const slugMapping = {
  'custom-web-development': 'web-development',
  'web-development': 'web-development',
  'website-development': 'web-development',
  'ui-ux-design-services': 'ui-ux-design',
  'ui-ux-design': 'ui-ux-design',
  'seo-services': 'seo-services',
  'ppc-services': 'ppc-services',
  'smm-services': 'smm-services',
  'content-marketing': 'content-marketing',
  'email-marketing': 'email-marketing',
  'graphics-design': 'graphics-design',
  'logo-design': 'logo-design',
  'motion-graphics': 'motion-graphics',
  'brand-identity': 'brand-identity',
  'ai-solutions': 'ai-solutions',
  'ecommerce-solutions': 'ecommerce-solutions',
  'software-development': 'software-development',
  'mobile-app-development': 'mobile-app-development',
  'digital-marketing': 'digital-marketing',
};

const ServiceRouter = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [pageExists, setPageExists] = useState(false);

  useEffect(() => {
    const checkPage = async () => {
      try {
        setLoading(true);
        
        // ✅ Apply slug mapping
        const mappedSlug = slugMapping[slug] || slug;
        
        console.log('🔍 Checking page for slug:', mappedSlug);
        
        // ✅ Check if page exists in database
        const res = await axios.get(`${API_URL}/pages/${mappedSlug}`);
        
        if (res.data.success && res.data.page) {
          console.log('✅ Page found in database');
          setPageExists(true);
        } else {
          console.log('❌ Page not found in database');
          setPageExists(false);
        }
      } catch (err) {
        console.log('❌ Error:', err.message);
        setPageExists(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPage();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid #cc7722', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ✅ ONLY SHOW DYNAMIC PAGE IF IT EXISTS IN DATABASE
  if (pageExists) {
    return <DynamicPage />;
  }

  // ✅ IF PAGE NOT FOUND - SHOW 404 / NOT CONFIGURED
  return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <h2>Page Not Found</h2>
      <p>The service page you're looking for has not been configured yet.</p>
      <p style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
        Please contact the administrator to set up this page.
      </p>
      <a href="/" style={{ display: 'inline-block', marginTop: '30px', background: '#cc7722', color: 'white', padding: '10px 24px', textDecoration: 'none' }}>
        Back to Home
      </a>
    </div>
  );
};

export default ServiceRouter;