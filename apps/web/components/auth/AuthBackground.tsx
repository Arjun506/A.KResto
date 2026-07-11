'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle collection
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.38 + 0.12,
      speedAlpha: Math.random() * 0.006 + 0.002,
      phase: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = resolvedTheme === 'dark';

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speedAlpha;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(168, 85, 247, ${Math.max(0.015, currentAlpha * 0.35)})` // Purple glow particles in dark
          : `rgba(37, 99, 235, ${Math.max(0.015, currentAlpha * 0.16)})`; // Blue particles in light
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-700">
      {/* Aurora lights and glows */}
      <div 
        className="absolute -top-[30%] -left-[20%] w-[75vw] h-[75vw] rounded-full filter blur-[130px] opacity-25 dark:opacity-40 mix-blend-screen pointer-events-none animate-pulse" 
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)',
          animationDuration: '10s'
        }}
      />
      <div 
        className="absolute -bottom-[20%] -right-[10%] w-[65vw] h-[65vw] rounded-full filter blur-[130px] opacity-20 dark:opacity-35 mix-blend-screen pointer-events-none animate-pulse" 
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          animationDuration: '14s',
          animationDelay: '2s'
        }}
      />
      
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70 dark:opacity-90" />
    </div>
  );
}
