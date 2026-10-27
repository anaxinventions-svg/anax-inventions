import { useState, useEffect } from 'react';

export const useSectionTheme = () => {
  const [isDarkSection, setIsDarkSection] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if section has dark background class
            const hasDarkBg = entry.target.classList.contains('dark-section') || 
                             entry.target.classList.contains('ow-section') ||
                             entry.target.classList.contains('wcu-section');
            setIsDarkSection(hasDarkBg);
          }
        });
      },
      { threshold: 0.3 } // 30% section visible hone pe trigger
    );

    // Observe all sections
    const sections = document.querySelectorAll('section, .ow-section, .wcu-section, .trust-section, .os-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return isDarkSection;
};