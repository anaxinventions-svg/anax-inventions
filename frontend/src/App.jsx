import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import OurServices from './components/OurServices/OurServices';
import ServicesBanner from './components/ServicesBanner/ServicesBanner';
import OurWork from './components/OurWork/OurWork';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Testimonials from './components/Testimonials/Testimonials';
import ContactUs from './components/ContactUs/ContactUs';
import Footer from './components/Footer/Footer';
import ContactSidebar from './components/ContactSidebar/ContactSidebar';
import AdminDashboard from './components/Admin control/AdminDashboard';
import ClientDashboard from './components/Client control/ClientDashboard';
import Auth from './components/Auth/Auth';
import Portfolio from './components/portfolio/Portfolio';
import ServiceRouter from './components/ServicePages/ServiceRouter'; // ✅ SERVICE ROUTER IMPORT

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Website Component
const MainWebsite = ({ onOpenClientLogin }) => {
  const [isDarkSection, setIsDarkSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      const elementAtCenter = document.elementFromPoint(150, viewportCenter);
      
      if (!elementAtCenter) {
        setIsDarkSection(false);
        return;
      }
      
      let target = elementAtCenter.closest('.dark-section');
      if (!target) target = elementAtCenter.closest('.ow-section');
      if (!target) target = elementAtCenter.closest('.stack-work');
      
      setIsDarkSection(!!target);
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-stack">
      <Navbar onOpenLogin={onOpenClientLogin} />
      <div className="stack-layer stack-hero"><Hero /></div>
      <OurServices />
      <div className="stack-layer stack-trust"><ServicesBanner /></div>
      <div className="stack-layer stack-work dark-section"><OurWork /></div>
      <div className="wcu-wrapper"><WhyChooseUs /></div>
      <div className="testimonials-reveal-wrapper"><Testimonials /></div>
      <div style={{ position: 'relative', zIndex: 200, background: '#1d2e2a', marginTop: 0 }}>
        <Footer />
      </div>
      <ContactSidebar isDarkSection={isDarkSection} />
    </div>
  );
};

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const openClientLogin = () => {
    setIsAdminLogin(false);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const handleAdminLogin = () => {
      setIsAdminLogin(true);
      setAuthModalOpen(true);
    };
    
    window.addEventListener('openAdminLogin', handleAdminLogin);
    return () => window.removeEventListener('openAdminLogin', handleAdminLogin);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<MainWebsite onOpenClientLogin={openClientLogin} />} />
        
        {/* Portfolio Page */}
        <Route path="/portfolio" element={
          <>
            <Navbar onOpenLogin={openClientLogin} />
            <Portfolio />
            <Footer />
          </>
        } />
        
        {/* Contact Page */}
        <Route path="/contact" element={
          <>
            <Navbar onOpenLogin={openClientLogin} />
            <ContactUs />
            <Footer />
          </>
        } />
        
        {/* ✅ SERVICE DETAIL PAGE - DYNAMIC ROUTE */}
        <Route path="/services/:slug" element={
          <>
            <Navbar onOpenLogin={openClientLogin} />
            <ServiceRouter />
            <Footer />
          </>
        } />
        
        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Client Dashboard */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<MainWebsite onOpenClientLogin={openClientLogin} />} />
      </Routes>
      
      <Auth 
        isOpen={authModalOpen} 
        onClose={() => {
          setAuthModalOpen(false);
          setIsAdminLogin(false);
        }}
        adminMode={isAdminLogin}
      />
    </Router>
  );
}

export default App;