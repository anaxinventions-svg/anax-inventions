import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import NetworkBackground from '../NetworkBackground';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const Hero = () => {
  const [content, setContent] = useState(null);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const headlineX = useTransform(smoothX, [-500, 500], [-25, 25]);
  const headlineY = useTransform(smoothY, [-500, 500], [-20, 20]);

  // Auto-rotate service text every 4 seconds
  useEffect(() => {
    if (!content?.serviceTexts?.length || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % content.serviceTexts.length);
    }, content?.rotationInterval || 4000);
    return () => clearInterval(interval);
  }, [content?.serviceTexts, content?.rotationInterval, isAutoPlaying]);

  useEffect(() => {
    fetchHeroContent();
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const fetchHeroContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/hero`);
      if (res.data.content) setContent(res.data.content);
    } catch (err) {
      console.log('Using default hero content');
    }
  };

  const heroData = {
    badge: content?.badge || 'Premium Digital Agency',
    headingLine1: content?.headingLine1 || 'We Craft',
    headingLine2: content?.headingLine2 || 'Digital Products',
    headingLine3: content?.headingLine3 || 'That Win',
    description: content?.description || 'A full-service digital agency specializing in MERN stack development, stunning UI/UX design, and scalable solutions.',
    button1Text: content?.button1Text || 'Start a Project',
    button1Link: content?.button1Link || '/contact',
    button2Text: content?.button2Text || 'View Portfolio',
    button2Link: content?.button2Link || '/portfolio',
    serviceTexts: content?.serviceTexts || [
      { text: 'Web Development', color: '#cc7722' },
      { text: 'UI/UX Design', color: '#cc7722' },
      { text: 'Digital Marketing', color: '#cc7722' },
      { text: 'E-Commerce Solutions', color: '#cc7722' },
      { text: 'App Development', color: '#cc7722' },
      { text: 'Customer Support', color: '#cc7722' },
    ],
    rotationInterval: content?.rotationInterval || 4000,
  };

  const currentService = heroData.serviceTexts[currentServiceIndex] || heroData.serviceTexts[0];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const handleDotClick = (index) => {
    setCurrentServiceIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const textVariants = {
    enter: (direction) => ({ y: direction > 0 ? 40 : -40, opacity: 0, scale: 0.9 }),
    center: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: (direction) => ({ y: direction > 0 ? -40 : 40, opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
  };

  const letterContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  };

  const renderAnimatedText = (text) => {
    return text.split('').map((char, index) => (
      <motion.span key={`${text}-${index}`} variants={letterAnimation} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ));
  };

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden bg-white hero-section" style={{ height: 'calc(100vh - 85px)' }}>
      <NetworkBackground />
      <div className="relative z-20 w-full mx-auto px-4 sm:px-6 py-0 sm:py-14 text-center hero-content-wrapper" style={{ maxWidth: '100%' }}>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl py-6 sm:py-12 px-3 sm:px-6 shadow-[0_0_60px_40px_rgba(255,255,255,0.9)] sm:shadow-[0_0_100px_80px_rgba(255,255,255,0.95)] hero-card">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }} className="flex flex-col items-center">

            {/* BADGE */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#cc7722]/30 bg-[#cc7722]/5 mb-4 sm:mb-6">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#cc7722]" />
              <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#cc7722] whitespace-nowrap">{heroData.badge}</span>
            </motion.div>

            {/* HEADING with Animated Service Text - FIXED FOR FULL WIDTH */}
            <motion.div style={!isMobile ? { x: headlineX, y: headlineY } : {}} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }} className="w-full">
              <h1 className="font-black tracking-tight text-[#1d2e2a] uppercase hero-main-heading" style={{ fontFamily: isMobile ? "'Inter', 'Segoe UI', sans-serif" : "'Playfair Display', serif", fontSize: isMobile ? '1.6rem' : 'clamp(2.8rem, 5vw, 5.5rem)', lineHeight: isMobile ? '1.2' : '1.15', letterSpacing: isMobile ? '-0.5px' : '-1px', fontWeight: isMobile ? '800' : '900', marginBottom: isMobile ? '0.5rem' : '0.8rem', textShadow: !isMobile ? '0px 2px 0px rgba(0,0,0,0.05), 0px 4px 8px rgba(0,0,0,0.05)' : 'none', width: '100%', maxWidth: '100%' }}>
                <span className="block">{heroData.headingLine1}</span>

                {/* ANIMATED SERVICE TEXT - FIXED: Full width, no clipping */}
                <span className="block relative hero-animated-text-line" style={{ minHeight: isMobile ? '2.2rem' : 'clamp(3.5rem, 6vw, 7rem)', display: 'block', width: '100%', overflow: 'visible' }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span 
                      key={currentServiceIndex} 
                      className="absolute inset-0 flex items-center justify-center italic hero-animated-word" 
                      style={{ color: currentService?.color || '#cc7722', width: '100%' }} 
                      variants={textVariants} 
                      initial="enter" 
                      animate="center" 
                      exit="exit" 
                      custom={1}
                    >
                      <motion.span 
                        variants={letterContainer} 
                        initial="hidden" 
                        animate="visible" 
                        className="inline-flex hero-letter-container"
                      >
                        {renderAnimatedText(currentService?.text || heroData.headingLine2)}
                      </motion.span>
                    </motion.span>
                  </AnimatePresence>
                </span>

                <span className="block">{heroData.headingLine3}</span>
              </h1>
            </motion.div>

            {/* SERVICE NAVIGATION DOTS */}
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } } }} className="flex items-center gap-2 mb-4 sm:mb-6">
              {heroData.serviceTexts.map((service, index) => (
                <button key={index} onClick={() => handleDotClick(index)} className={`service-dot ${index === currentServiceIndex ? 'active' : ''}`} title={service.text}>
                  <span className="dot-indicator" />
                  {index === currentServiceIndex && <motion.span layoutId="activeService" className="dot-active-ring" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                </button>
              ))}
            </motion.div>

            {/* DESCRIPTION */}
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.0 } } }} className="max-w-[300px] sm:max-w-md md:max-w-lg mx-auto text-[0.8rem] sm:text-base md:text-lg text-[#555] font-light leading-relaxed mb-5 sm:mb-10 px-2 sm:px-4">
              {heroData.description}
            </motion.p>

            {/* BUTTONS */}
            <motion.div variants={{ hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 1.3 } } }} className="flex flex-col-reverse sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-2 sm:px-0">
              <motion.a href={heroData.button1Link} variants={{ hidden: { opacity: 0, y: 15, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } } }} whileHover={{ scale: 1.05, backgroundColor: '#cc7722' }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-4 bg-[#1d2e2a] text-white text-[0.8rem] sm:text-sm font-bold rounded-xl no-underline transition-all duration-300 cursor-pointer shadow-lg shadow-[#1d2e2a]/10">
                {heroData.button1Text} →
              </motion.a>
              <motion.a href={heroData.button2Link} variants={{ hidden: { opacity: 0, y: 15, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: 0.1 } } }} whileHover={{ scale: 1.05, borderColor: '#cc7722', color: '#cc7722' }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-4 bg-transparent text-[#1d2e2a] text-[0.8rem] sm:text-sm font-semibold rounded-xl no-underline border-2 border-[#d5d5d5] transition-all duration-300 cursor-pointer">
                {heroData.button2Text}
              </motion.a>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;