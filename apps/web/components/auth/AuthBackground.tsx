'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  speed: number;
  color: string;
}

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

    const isDark = resolvedTheme === 'dark';

    // Glowing vibrant palette for light & dark modes
    const particleColors = isDark
      ? [
          'rgba(59, 130, 246, 0.45)',  // Cyan/Electric Blue
          'rgba(147, 51, 234, 0.45)',  // Deep Purple
          'rgba(168, 85, 247, 0.45)',  // Neon Lavender
          'rgba(6, 182, 212, 0.4)',   // Bright Cyan
          'rgba(52, 211, 153, 0.35)',  // Mint Emerald
        ]
      : [
          'rgba(37, 99, 235, 0.35)',   // Royal Blue
          'rgba(59, 130, 246, 0.35)',  // Electric Blue
          'rgba(168, 85, 247, 0.35)',  // Lavender
          'rgba(14, 165, 233, 0.35)',  // Bright Cyan
        ];

    // Initialize 60fps floating particles
    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 4.5 + 1.5,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI,
      speed: Math.random() * 0.008 + 0.003,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }));

    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Flowing wave lines
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(37, 99, 235, 0.08)';
      ctx.lineWidth = 1.8;

      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        const amplitude = 40 + j * 15;
        const frequency = 0.0018 + j * 0.0006;
        const speed = 0.016 - j * 0.003;

        for (let x = 0; x < W; x += 12) {
          const y =
            H * (0.35 + j * 0.15) +
            Math.sin(x * frequency + waveOffset * speed) * amplitude +
            Math.cos(x * 0.002 - waveOffset * 0.005) * 22;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      waveOffset += 0.6;

      // Draw glowing particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        gradient.addColorStop(0, p.color.replace(/0\.\d+/, String(Math.max(0.05, currentAlpha))));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
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
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-700 bg-slate-950 dark:bg-[#060814]">
      {/* 3D Glowing Aurora Light Mesh Orbs */}
      <div
        className="absolute -top-[30%] -left-[15%] w-[75vw] h-[75vw] rounded-full filter blur-[130px] opacity-35 dark:opacity-45 pointer-events-none animate-pulse"
        style={{
          background: resolvedTheme === 'dark'
            ? 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(147,51,234,0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(96,165,250,0.3) 0%, rgba(192,132,252,0.15) 50%, transparent 70%)',
          animationDuration: '14s',
        }}
      />
      <div
        className="absolute -bottom-[25%] -right-[15%] w-[70vw] h-[70vw] rounded-full filter blur-[130px] opacity-30 dark:opacity-40 pointer-events-none animate-pulse"
        style={{
          background: resolvedTheme === 'dark'
            ? 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(56,189,248,0.2) 50%, transparent 70%)',
          animationDuration: '18s',
          animationDelay: '3s',
        }}
      />
      <div
        className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] rounded-full filter blur-[110px] opacity-20 dark:opacity-30 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 65%)',
          animationDuration: '16s',
          animationDelay: '1s',
        }}
      />

      {/* Grid line pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
}


