import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const loadVanta = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
      script.onload = () => {
        if (window.VANTA && vantaRef.current) {
          const vantaEffect = window.VANTA.NET({
            el: vantaRef.current,
            THREE: THREE,
            
            // ANAX Green color for lines & dots
            color: 0x1d2e2a,
            backgroundColor: 0xffffff,
            
            // NETWORK SETTINGS - dense connected network
            points: 20,
            maxDistance: 35,
            spacing: 10,
            showDots: true,
            
            // Animation speed
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            
            // Bigger scale
            scale: 1.3,
            scaleMobile: 0.9,
          });

          vantaRef.current._vantaEffect = vantaEffect;
        }
      };
      document.body.appendChild(script);
    };
    
    loadVanta();
    
    return () => {
      if (vantaRef.current?._vantaEffect) {
        vantaRef.current._vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      className="absolute inset-0 z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default VantaBackground;