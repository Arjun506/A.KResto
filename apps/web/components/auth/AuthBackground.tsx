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

    // Premium Color Palette matching requirements
    const particleColors = isDark
      ? [
          'rgba(59, 130, 246, 0.25)',  // Electric Blue
          'rgba(124, 58, 237, 0.25)',  // Purple
          'rgba(168, 85, 247, 0.25)',  // Lavender
          'rgba(16, 185, 129, 0.2)',   // Emerald
          'rgba(52, 211, 153, 0.2)',   // Mint Green
        ]
      : [
          'rgba(37, 99, 235, 0.15)',   // Royal Blue
          'rgba(59, 130, 246, 0.15)',  // Electric Blue
          'rgba(168, 85, 247, 0.15)',  // Lavender
          'rgba(52, 211, 153, 0.12)',  // Mint Green
        ];

    // Initialize 60fps particles
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 4 + 1.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI,
      speed: Math.random() * 0.005 + 0.002,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }));

    // Animated Wave Lines
    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw Wave lines (cinematic flowing lines)
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(37, 99, 235, 0.03)';
      ctx.lineWidth = 1.5;

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const amplitude = 35 + j * 15;
        const frequency = 0.0015 + j * 0.0005;
        const speed = 0.015 - j * 0.003;

        for (let x = 0; x < W; x += 10) {
          const y =
            H * (0.4 + j * 0.15) +
            Math.sin(x * frequency + waveOffset * speed) * amplitude +
            Math.cos(x * 0.002 - waveOffset * 0.005) * 20;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      waveOffset += 0.5;

      // Draw Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        // Bounce checks
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Pulse alpha
        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        // Radial gradient glow on particles for premium feel
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.8);
        gradient.addColorStop(0, p.color.replace('0.25', String(currentAlpha)).replace('0.15', String(currentAlpha)));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Subtle light ray refraction effects across diagonals
      const rayGradient = ctx.createLinearGradient(0, 0, W, H);
      if (isDark) {
        rayGradient.addColorStop(0, 'rgba(59, 130, 246, 0.015)');  // subtle blue top left
        rayGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.01)'); // purple middle
        rayGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        rayGradient.addColorStop(0, 'rgba(37, 99, 235, 0.02)');
        rayGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.01)');
        rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = rayGradient;
      ctx.fillRect(0, 0, W, H);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-700">
      {/* 3D Aurora Mesh Backdrop Lights */}
      <div
        className="absolute -top-[40%] -left-[20%] w-[80vw] h-[80vw] rounded-full filter blur-[140px] opacity-25 dark:opacity-40 mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
          animationDuration: '12s',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[10%] w-[70vw] h-[70vw] rounded-full filter blur-[140px] opacity-20 dark:opacity-35 mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          animationDuration: '16s',
          animationDelay: '3s',
        }}
      />
      {/* Light cyan/mint mist center glow */}
      <div
        className="absolute top-[20%] left-[30%] w-[50vw] h-[50vw] rounded-full filter blur-[120px] opacity-[0.08] dark:opacity-[0.15] mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 60%)',
          animationDuration: '18s',
          animationDelay: '1s',
        }}
      />

      {/* Glass cards diagonal reflection glares */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.04] dark:via-white/[0.005] dark:to-white/[0.02] pointer-events-none" />

      {/* Particle & Wave Drawing Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80 dark:opacity-90" />
    </div>
  );
}

