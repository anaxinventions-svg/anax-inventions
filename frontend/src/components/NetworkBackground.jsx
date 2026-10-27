import { useEffect, useRef } from 'react';

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const clearZoneWidth = 550;
    const clearZoneHeight = 400;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // MORE nodes for denser network
    const nodeCount = 100;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodes.forEach((node) => {
        // Mouse attraction - STRONGER
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          node.x += dx * 0.006;
          node.y += dy * 0.006;
        }

        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const inClearZone = 
          node.x > centerX - clearZoneWidth/2 && 
          node.x < centerX + clearZoneWidth/2 && 
          node.y > centerY - clearZoneHeight/2 && 
          node.y < centerY + clearZoneHeight/2;

        if (!inClearZone) {
          // BIGGER glow
          const pulse = Math.sin(node.pulse) * 0.3 + 0.7;
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 5);
          gradient.addColorStop(0, `rgba(29, 46, 42, ${0.9 * pulse})`);
          gradient.addColorStop(0.4, `rgba(29, 46, 42, ${0.5 * pulse})`);
          gradient.addColorStop(1, 'rgba(29, 46, 42, 0)');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // BIGGER core dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(29, 46, 42, ${0.95 * pulse})`;
          ctx.fill();
        }
      });

      // Draw THICKER connections
      nodes.forEach((nodeA, i) => {
        const inClearA = 
          nodeA.x > centerX - clearZoneWidth/2 && 
          nodeA.x < centerX + clearZoneWidth/2 && 
          nodeA.y > centerY - clearZoneHeight/2 && 
          nodeA.y < centerY + clearZoneHeight/2;

        nodes.slice(i + 1).forEach((nodeB) => {
          const inClearB = 
            nodeB.x > centerX - clearZoneWidth/2 && 
            nodeB.x < centerX + clearZoneWidth/2 && 
            nodeB.y > centerY - clearZoneHeight/2 && 
            nodeB.y < centerY + clearZoneHeight/2;

          if (inClearA || inClearB) return;

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // LONGER distance + THICKER lines
          if (dist < 200) {
            const opacity = (1 - dist / 200) * 0.5;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(29, 46, 42, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%', background: '#ffffff' }}
    />
  );
};

export default NetworkBackground;