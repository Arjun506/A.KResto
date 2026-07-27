'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

type EffectType = 'galaxy' | 'snow' | 'storm' | 'birds' | 'clouds' | 'net';

const effectNames: Record<EffectType, string> = {
  galaxy: 'Galaxy',
  snow: 'Snowfall',
  storm: 'Thunderstorm',
  birds: 'Birds',
  clouds: 'Clouds',
  net: 'Internet'
};

const effectsList: EffectType[] = ['galaxy', 'snow', 'storm', 'birds', 'clouds', 'net'];

export default function BackgroundEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  
  const [currentEffect, setCurrentEffect] = useState<EffectType>('galaxy');
  const [isAuto, setIsAuto] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  
  const currentEffectRef = useRef<EffectType>('galaxy');
  const isAutoRef = useRef(true);
  const themeRef = useRef<'light' | 'dark'>('dark');

  const SWITCH_INTERVAL = 10000; // 10s auto-switch
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const loopStateRef = useRef<{
    switchTimer: number;
    startTime: number;
    frameId: number;
    renderFn: ((t: number) => void) | null;
  }>({
    switchTimer: 0,
    startTime: 0,
    frameId: 0,
    renderFn: null
  });

  // Keep refs in sync for loop performance and closure safety
  useEffect(() => {
    currentEffectRef.current = currentEffect;
  }, [currentEffect]);

  useEffect(() => {
    isAutoRef.current = isAuto;
  }, [isAuto]);

  useEffect(() => {
    themeRef.current = (resolvedTheme === 'light' ? 'light' : 'dark');
  }, [resolvedTheme]);

  // Handle auto countdown timer interval
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isAuto) {
      setRemainingSeconds(10);
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuto, currentEffect]);

  // Main canvas animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Recreate active effect on resize to recalculate particles/bounds
      loopStateRef.current.renderFn = createEffect(currentEffectRef.current);
    }

    window.addEventListener('resize', resize);
    resize();

    // Helper functions
    function rand(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function paintBase() {
      if (!ctx) return;
      const isDark = themeRef.current === 'dark';
      const g = ctx.createLinearGradient(0, 0, 0, H);
      if (isDark) {
        g.addColorStop(0, '#050b1f');
        g.addColorStop(1, '#030712');
      } else {
        // Light theme gradient matching the mockup (soft light blue-slate)
        g.addColorStop(0, '#f0f4f9');
        g.addColorStop(1, '#f8fafc');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // Effect Creators
    function createEffect(type: EffectType) {
      switch (type) {
        case 'galaxy':
          return createGalaxy();
        case 'snow':
          return createSnow();
        case 'storm':
          return createStorm();
        case 'birds':
          return createBirds();
        case 'clouds':
          return createClouds();
        case 'net':
          return createNet();
        default:
          return createGalaxy();
      }
    }

    // ---- EFFECT: GALAXY ----
    function createGalaxy() {
      const stars = Array.from({ length: 220 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.4, 1.8),
        tw: rand(0, Math.PI * 2),
        speed: rand(0.008, 0.025)
      }));

      const nebulae = [
        { x: 0.2, y: 0.25, r: 420, cDark: 'rgba(124,58,237,.25)', cLight: 'rgba(147,51,234,.10)' },
        { x: 0.8, y: 0.2, r: 380, cDark: 'rgba(37,99,235,.20)', cLight: 'rgba(59,130,246,.08)' },
        { x: 0.5, y: 0.85, r: 440, cDark: 'rgba(6,182,212,.15)', cLight: 'rgba(6,182,212,.08)' },
        { x: 0.75, y: 0.7, r: 320, cDark: 'rgba(236,72,153,.10)', cLight: 'rgba(244,63,94,.06)' }
      ];

      let shooting: { x: number; y: number; len: number; vx: number; vy: number; life: number } | null = null;
      let shootTimer = rand(100, 250);

      return function frame(t: number) {
        if (!ctx) return;
        paintBase();
        const isDark = themeRef.current === 'dark';

        // Nebulae glow
        nebulae.forEach(n => {
          const cx = n.x * W + Math.sin(t * 0.0001 + n.r) * 30;
          const cy = n.y * H + Math.cos(t * 0.00008 + n.r) * 30;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
          grad.addColorStop(0, isDark ? n.cDark : n.cLight);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        });

        // Twinkling stars
        stars.forEach(s => {
          s.tw += s.speed;
          const alpha = 0.3 + Math.abs(Math.sin(s.tw)) * 0.7;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 7);
          ctx.fillStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(30,41,59,${alpha * 0.5})`;
          ctx.fill();
        });

        // Shooting star
        shootTimer--;
        if (shootTimer <= 0 && !shooting) {
          shooting = {
            x: rand(0, W * 0.6),
            y: rand(0, H * 0.3),
            len: rand(80, 160),
            vx: rand(6, 11),
            vy: rand(3, 6),
            life: 40
          };
        }

        if (shooting) {
          ctx.beginPath();
          ctx.moveTo(shooting.x, shooting.y);
          ctx.lineTo(shooting.x - shooting.len, shooting.y - shooting.len * 0.4);
          const grad = ctx.createLinearGradient(
            shooting.x,
            shooting.y,
            shooting.x - shooting.len,
            shooting.y - shooting.len * 0.4
          );
          if (isDark) {
            grad.addColorStop(0, 'rgba(255,255,255,.8)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
          } else {
            grad.addColorStop(0, 'rgba(30,41,59,.6)');
            grad.addColorStop(1, 'rgba(30,41,59,0)');
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.0;
          ctx.stroke();
          shooting.x += shooting.vx;
          shooting.y += shooting.vy;
          shooting.life--;
          if (shooting.life <= 0) {
            shooting = null;
            shootTimer = rand(120, 300);
          }
        }
      };
    }

    // ---- EFFECT: SNOW ----
    function createSnow() {
      const flakes = Array.from({ length: 170 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(1, 3.8),
        speed: rand(0.4, 1.8),
        drift: rand(-0.6, 0.6),
        phase: rand(0, Math.PI * 2),
        wobble: rand(0.3, 0.8)
      }));

      return function frame() {
        if (!ctx) return;
        paintBase();
        const isDark = themeRef.current === 'dark';

        const grad = ctx.createRadialGradient(W * 0.5, H * 0.1, 0, W * 0.5, H * 0.1, W * 0.7);
        if (isDark) {
          grad.addColorStop(0, 'rgba(59,130,246,.12)');
        } else {
          grad.addColorStop(0, 'rgba(37,99,235,.06)');
        }
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        flakes.forEach(f => {
          f.y += f.speed;
          f.phase += 0.015;
          f.x += Math.sin(f.phase) * f.drift * f.wobble;
          if (f.y > H) {
            f.y = -5;
            f.x = rand(0, W);
          }
          if (f.x > W) f.x = 0;
          if (f.x < 0) f.x = W;

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, 7);
          const alpha = 0.7 + Math.sin(f.phase + f.x) * 0.15 + 0.15;
          ctx.fillStyle = isDark ? `rgba(255,255,255,${Math.min(1, alpha)})` : `rgba(51,65,85,${Math.min(1, alpha * 0.7)})`;
          ctx.fill();
        });
      };
    }

    // ---- EFFECT: THUNDERSTORM ----
    function createStorm() {
      const drops = Array.from({ length: 210 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        len: rand(10, 24),
        speed: rand(8, 16)
      }));

      const clouds = Array.from({ length: 6 }, () => ({
        x: rand(0, W),
        y: rand(0, H * 0.35),
        w: rand(180, 340),
        speed: rand(0.08, 0.28)
      }));

      let flash = 0;
      let flashTimer = rand(70, 200);

      return function frame() {
        if (!ctx) return;
        const isDark = themeRef.current === 'dark';

        const g = ctx.createLinearGradient(0, 0, 0, H);
        if (isDark) {
          g.addColorStop(0, '#0a0f1f');
          g.addColorStop(1, '#030712');
        } else {
          g.addColorStop(0, '#e2e8f0');
          g.addColorStop(1, '#f1f5f9');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        // Render clouds
        clouds.forEach(c => {
          c.x += c.speed;
          if (c.x - c.w > W) c.x = -c.w;
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
          if (isDark) {
            grad.addColorStop(0, 'rgba(30,41,59,.50)');
          } else {
            grad.addColorStop(0, 'rgba(148,163,184,.35)');
          }
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.w, c.w * 0.4, 0, 0, 7);
          ctx.fill();
        });

        // Render rain drops
        ctx.strokeStyle = isDark ? 'rgba(148,163,184,.30)' : 'rgba(71,85,105,.30)';
        ctx.lineWidth = 1.0;
        drops.forEach(d => {
          d.y += d.speed;
          if (d.y > H) {
            d.y = -12;
            d.x = rand(0, W);
          }
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2.5, d.y + d.len);
          ctx.stroke();
        });

        // Flash timer logic
        flashTimer--;
        if (flashTimer <= 0 && flash <= 0) {
          flash = 8;
          flashTimer = rand(130, 300);
        }

        if (flash > 0) {
          // Lightning screen glow flash
          ctx.fillStyle = isDark 
            ? `rgba(224,242,254,${(flash / 8) * 0.28})` 
            : `rgba(186,230,253,${(flash / 8) * 0.20})`;
          ctx.fillRect(0, 0, W, H);

          if (flash === 8) {
            // Draw lightning bolt
            ctx.strokeStyle = isDark ? 'rgba(255,255,255,.9)' : 'rgba(30,41,59,.8)';
            ctx.lineWidth = 2.5;
            let x = rand(W * 0.2, W * 0.8);
            let y = 0;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (let i = 0; i < 6; i++) {
              x += rand(-45, 45);
              y += rand(30, 65);
              ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Branching bolt
            ctx.strokeStyle = isDark ? 'rgba(200,200,255,.5)' : 'rgba(71,85,105,.5)';
            ctx.lineWidth = 1.5;
            let x2 = x + rand(-30, 30);
            let y2 = y - rand(10, 30);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          flash--;
        }
      };
    }

    // ---- EFFECT: BIRDS ----
    function createBirds() {
      const birds = Array.from({ length: 16 }, () => ({
        x: rand(-120, W),
        y: rand(H * 0.08, H * 0.6),
        s: rand(6, 16),
        speed: rand(0.8, 2.6),
        wing: rand(0, Math.PI * 2),
        wspeed: rand(0.12, 0.28),
        phase: rand(0, Math.PI * 2)
      }));

      return function frame(t: number) {
        if (!ctx) return;
        paintBase();
        const isDark = themeRef.current === 'dark';

        const grad = ctx.createRadialGradient(W * 0.5, H * 0.2, 0, W * 0.5, H * 0.2, W * 0.8);
        if (isDark) {
          grad.addColorStop(0, 'rgba(37,99,235,.08)');
        } else {
          grad.addColorStop(0, 'rgba(37,99,235,.04)');
        }
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        birds.forEach(b => {
          b.x += b.speed;
          b.wing += b.wspeed;
          b.y += Math.sin(b.phase + t * 0.0002) * 0.2;
          if (b.x > W + 60) {
            b.x = -60;
            b.y = rand(H * 0.08, H * 0.6);
          }

          const flap = Math.sin(b.wing) * b.s * 0.55;
          ctx.beginPath();
          ctx.moveTo(b.x - b.s, b.y + flap);
          ctx.quadraticCurveTo(b.x, b.y - b.s * 0.45, b.x + b.s, b.y + flap);
          ctx.strokeStyle = isDark ? 'rgba(226,232,240,.70)' : 'rgba(30,41,59,.70)';
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Second wing line (depth)
          ctx.beginPath();
          ctx.moveTo(b.x - b.s * 0.8, b.y + flap * 0.6);
          ctx.quadraticCurveTo(b.x, b.y + b.s * 0.3, b.x + b.s * 0.8, b.y + flap * 0.6);
          ctx.strokeStyle = isDark ? 'rgba(226,232,240,.40)' : 'rgba(71,85,105,.40)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        });
      };
    }

    // ---- EFFECT: CLOUDS ----
    function createClouds() {
      const clouds = Array.from({ length: 10 }, () => ({
        x: rand(0, W),
        y: rand(H * 0.05, H * 0.7),
        w: rand(120, 280),
        speed: rand(0.08, 0.4),
        op: rand(0.08, 0.28),
        drift: rand(-0.3, 0.3)
      }));

      return function frame(t: number) {
        if (!ctx) return;
        paintBase();
        const isDark = themeRef.current === 'dark';

        clouds.forEach(c => {
          c.x += c.speed + Math.sin(t * 0.0001 + c.drift) * 0.1;
          if (c.x - c.w > W) c.x = -c.w;

          const fillCol = isDark ? '148,163,184' : '100,116,139';

          // Main cloud body
          const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
          grad.addColorStop(0, `rgba(${fillCol},${c.op})`);
          grad.addColorStop(0.5, `rgba(${fillCol},${c.op * 0.5})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.w, c.w * 0.4, 0, 0, 7);
          ctx.fill();

          // Secondary puff
          const grad2 = ctx.createRadialGradient(
            c.x - c.w * 0.3,
            c.y - c.w * 0.15,
            0,
            c.x - c.w * 0.3,
            c.y - c.w * 0.15,
            c.w * 0.7
          );
          grad2.addColorStop(0, `rgba(${fillCol},${c.op * 0.7})`);
          grad2.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad2;
          ctx.beginPath();
          ctx.ellipse(c.x - c.w * 0.3, c.y - c.w * 0.15, c.w * 0.7, c.w * 0.3, 0, 0, 7);
          ctx.fill();

          // Tertiary puff
          const grad3 = ctx.createRadialGradient(
            c.x + c.w * 0.3,
            c.y + c.w * 0.1,
            0,
            c.x + c.w * 0.3,
            c.y + c.w * 0.1,
            c.w * 0.6
          );
          grad3.addColorStop(0, `rgba(${fillCol},${c.op * 0.5})`);
          grad3.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad3;
          ctx.beginPath();
          ctx.ellipse(c.x + c.w * 0.3, c.y + c.w * 0.1, c.w * 0.6, c.w * 0.3, 0, 0, 7);
          ctx.fill();
        });
      };
    }

    // ---- EFFECT: NET ----
    function createNet() {
      const pts = Array.from({ length: 75 }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        r: rand(1.5, 3.8)
      }));
      let time = 0;

      return function frame() {
        if (!ctx) return;
        time += 0.005;
        paintBase();
        const isDark = themeRef.current === 'dark';

        pts.forEach(p => {
          p.x += p.vx + Math.sin(time + p.x * 0.001) * 0.15;
          p.y += p.vy + Math.cos(time + p.y * 0.001) * 0.15;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          p.x = Math.max(0, Math.min(W, p.x));
          p.y = Math.max(0, Math.min(H, p.y));
        });

        // Draw connections
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 140) {
              const alpha = (1 - d / 140) * 0.35;
              const width = 0.8 + (1 - d / 140) * 0.8;
              ctx.strokeStyle = isDark 
                ? `rgba(6,182,212,${alpha})` 
                : `rgba(37,99,235,${alpha * 0.8})`;
              ctx.lineWidth = width;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        pts.forEach(p => {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          if (isDark) {
            grad.addColorStop(0, 'rgba(124,58,237,.8)');
            grad.addColorStop(0.4, 'rgba(124,58,237,.4)');
          } else {
            grad.addColorStop(0, 'rgba(37,99,235,.4)');
            grad.addColorStop(0.4, 'rgba(37,99,235,.2)');
          }
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, 7);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 7);
          ctx.fillStyle = isDark ? 'rgba(255,255,255,.9)' : 'rgba(30,41,59,.9)';
          ctx.fill();
        });
      };
    }

    // Set initial active effect
    loopStateRef.current.renderFn = createEffect(currentEffectRef.current);
    loopStateRef.current.startTime = performance.now();

    // Render loop
    function loop(timestamp: number) {
      if (!ctx) return;
      const elapsed = timestamp - loopStateRef.current.startTime;

      // Handle auto switch
      if (isAutoRef.current) {
        loopStateRef.current.switchTimer += 16.7;
        if (loopStateRef.current.switchTimer >= SWITCH_INTERVAL) {
          loopStateRef.current.switchTimer = 0;
          const keys = effectsList;
          const idx = (keys.indexOf(currentEffectRef.current) + 1) % keys.length;
          const next = keys[idx];
          
          currentEffectRef.current = next;
          setCurrentEffect(next);
          loopStateRef.current.renderFn = createEffect(next);
        }
      }

      if (loopStateRef.current.renderFn) {
        loopStateRef.current.renderFn(elapsed);
      }
      loopStateRef.current.frameId = requestAnimationFrame(loop);
    }

    loopStateRef.current.frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(loopStateRef.current.frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Update render function when active effect changes manually
  const selectEffect = (effect: EffectType) => {
    setCurrentEffect(effect);
    currentEffectRef.current = effect;
    loopStateRef.current.switchTimer = 0;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let W = window.innerWidth;
        let H = window.innerHeight;
        
        function rand(a: number, b: number) { return a + Math.random() * (b - a); }
        
        function paintBase() {
          const isDark = themeRef.current === 'dark';
          const g = ctx.createLinearGradient(0, 0, 0, H);
          if (isDark) {
            g.addColorStop(0, '#050b1f');
            g.addColorStop(1, '#030712');
          } else {
            g.addColorStop(0, '#f0f4f9');
            g.addColorStop(1, '#f8fafc');
          }
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        }

        if (effect === 'galaxy') {
          const stars = Array.from({ length: 220 }, () => ({
            x: rand(0, W), y: rand(0, H), r: rand(0.4, 1.8), tw: rand(0, Math.PI * 2), speed: rand(0.008, 0.025)
          }));
          const nebulae = [
            { x: 0.2, y: 0.25, r: 420, cDark: 'rgba(124,58,237,.25)', cLight: 'rgba(147,51,234,.10)' },
            { x: 0.8, y: 0.2, r: 380, cDark: 'rgba(37,99,235,.20)', cLight: 'rgba(59,130,246,.08)' },
            { x: 0.5, y: 0.85, r: 440, cDark: 'rgba(6,182,212,.15)', cLight: 'rgba(6,182,212,.08)' },
            { x: 0.75, y: 0.7, r: 320, cDark: 'rgba(236,72,153,.10)', cLight: 'rgba(244,63,94,.06)' }
          ];
          let shooting: any = null;
          let shootTimer = rand(100, 250);
          loopStateRef.current.renderFn = function(t) {
            paintBase();
            const isDark = themeRef.current === 'dark';
            nebulae.forEach(n => {
              const cx = n.x * W + Math.sin(t * 0.0001 + n.r) * 30;
              const cy = n.y * H + Math.cos(t * 0.00008 + n.r) * 30;
              const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
              grad.addColorStop(0, isDark ? n.cDark : n.cLight);
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, W, H);
            });
            stars.forEach(s => {
              s.tw += s.speed;
              const alpha = 0.3 + Math.abs(Math.sin(s.tw)) * 0.7;
              ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7);
              ctx.fillStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(30,41,59,${alpha * 0.5})`;
              ctx.fill();
            });
            shootTimer--;
            if (shootTimer <= 0 && !shooting) {
              shooting = { x: rand(0, W * 0.6), y: rand(0, H * 0.3), len: rand(80, 160), vx: rand(6, 11), vy: rand(3, 6), life: 40 };
            }
            if (shooting) {
              ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y);
              ctx.lineTo(shooting.x - shooting.len, shooting.y - shooting.len * 0.4);
              const grad = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.len, shooting.y - shooting.len * 0.4);
              if (isDark) {
                grad.addColorStop(0, 'rgba(255,255,255,.8)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
              } else {
                grad.addColorStop(0, 'rgba(30,41,59,.6)'); grad.addColorStop(1, 'rgba(30,41,59,0)');
              }
              ctx.strokeStyle = grad; ctx.lineWidth = 2.0; ctx.stroke();
              shooting.x += shooting.vx; shooting.y += shooting.vy; shooting.life--;
              if (shooting.life <= 0) { shooting = null; shootTimer = rand(120, 300); }
            }
          };
        } else if (effect === 'snow') {
          const flakes = Array.from({ length: 170 }, () => ({
            x: rand(0, W), y: rand(0, H), r: rand(1, 3.8), speed: rand(0.4, 1.8), drift: rand(-0.6, 0.6), phase: rand(0, Math.PI * 2), wobble: rand(0.3, 0.8)
          }));
          loopStateRef.current.renderFn = function() {
            paintBase();
            const isDark = themeRef.current === 'dark';
            const grad = ctx.createRadialGradient(W * 0.5, H * 0.1, 0, W * 0.5, H * 0.1, W * 0.7);
            grad.addColorStop(0, isDark ? 'rgba(59,130,246,.12)' : 'rgba(37,99,235,.06)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            flakes.forEach(f => {
              f.y += f.speed; f.phase += 0.015; f.x += Math.sin(f.phase) * f.drift * f.wobble;
              if (f.y > H) { f.y = -5; f.x = rand(0, W); }
              if (f.x > W) f.x = 0; if (f.x < 0) f.x = W;
              ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7);
              const alpha = 0.7 + Math.sin(f.phase + f.x) * 0.15 + 0.15;
              ctx.fillStyle = isDark ? `rgba(255,255,255,${Math.min(1, alpha)})` : `rgba(51,65,85,${Math.min(1, alpha * 0.7)})`;
              ctx.fill();
            });
          };
        } else if (effect === 'storm') {
          const drops = Array.from({ length: 210 }, () => ({
            x: rand(0, W), y: rand(0, H), len: rand(10, 24), speed: rand(8, 16)
          }));
          const clouds = Array.from({ length: 6 }, () => ({
            x: rand(0, W), y: rand(0, H * 0.35), w: rand(180, 340), speed: rand(0.08, 0.28)
          }));
          let flash = 0;
          let flashTimer = rand(70, 200);
          loopStateRef.current.renderFn = function() {
            const isDark = themeRef.current === 'dark';
            const g = ctx.createLinearGradient(0, 0, 0, H);
            if (isDark) { g.addColorStop(0, '#0a0f1f'); g.addColorStop(1, '#030712'); }
            else { g.addColorStop(0, '#e2e8f0'); g.addColorStop(1, '#f1f5f9'); }
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

            clouds.forEach(c => {
              c.x += c.speed; if (c.x - c.w > W) c.x = -c.w;
              const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
              grad.addColorStop(0, isDark ? 'rgba(30,41,59,.50)' : 'rgba(148,163,184,.35)');
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w, c.w * 0.4, 0, 0, 7); ctx.fill();
            });

            ctx.strokeStyle = isDark ? 'rgba(148,163,184,.30)' : 'rgba(71,85,105,.30)';
            ctx.lineWidth = 1.0;
            drops.forEach(d => {
              d.y += d.speed; if (d.y > H) { d.y = -12; d.x = rand(0, W); }
              ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 2.5, d.y + d.len); ctx.stroke();
            });

            flashTimer--;
            if (flashTimer <= 0 && flash <= 0) { flash = 8; flashTimer = rand(130, 300); }
            if (flash > 0) {
              ctx.fillStyle = isDark ? `rgba(224,242,254,${(flash / 8) * 0.28})` : `rgba(186,230,253,${(flash / 8) * 0.20})`;
              ctx.fillRect(0, 0, W, H);
              if (flash === 8) {
                ctx.strokeStyle = isDark ? 'rgba(255,255,255,.9)' : 'rgba(30,41,59,.8)'; ctx.lineWidth = 2.5;
                let x = rand(W * 0.2, W * 0.8), y = 0;
                ctx.beginPath(); ctx.moveTo(x, y);
                for (let i = 0; i < 6; i++) { x += rand(-45, 45); y += rand(30, 65); ctx.lineTo(x, y); }
                ctx.stroke();
                ctx.strokeStyle = isDark ? 'rgba(200,200,255,.5)' : 'rgba(71,85,105,.5)'; ctx.lineWidth = 1.5;
                let x2 = x + rand(-30, 30), y2 = y - rand(10, 30);
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
              }
              flash--;
            }
          };
        } else if (effect === 'birds') {
          const birds = Array.from({ length: 16 }, () => ({
            x: rand(-120, W), y: rand(H * 0.08, H * 0.6), s: rand(6, 16), speed: rand(0.8, 2.6), wing: rand(0, Math.PI * 2), wspeed: rand(0.12, 0.28), phase: rand(0, Math.PI * 2)
          }));
          loopStateRef.current.renderFn = function(t) {
            paintBase();
            const isDark = themeRef.current === 'dark';
            const grad = ctx.createRadialGradient(W * 0.5, H * 0.2, 0, W * 0.5, H * 0.2, W * 0.8);
            grad.addColorStop(0, isDark ? 'rgba(37,99,235,.08)' : 'rgba(37,99,235,.04)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
            birds.forEach(b => {
              b.x += b.speed; b.wing += b.wspeed; b.y += Math.sin(b.phase + t * 0.0002) * 0.2;
              if (b.x > W + 60) { b.x = -60; b.y = rand(H * 0.08, H * 0.6); }
              const flap = Math.sin(b.wing) * b.s * 0.55;
              ctx.beginPath(); ctx.moveTo(b.x - b.s, b.y + flap); ctx.quadraticCurveTo(b.x, b.y - b.s * 0.45, b.x + b.s, b.y + flap);
              ctx.strokeStyle = isDark ? 'rgba(226,232,240,.70)' : 'rgba(30,41,59,.70)'; ctx.lineWidth = 1.6; ctx.stroke();
              ctx.beginPath(); ctx.moveTo(b.x - b.s * 0.8, b.y + flap * 0.6); ctx.quadraticCurveTo(b.x, b.y + b.s * 0.3, b.x + b.s * 0.8, b.y + flap * 0.6);
              ctx.strokeStyle = isDark ? 'rgba(226,232,240,.40)' : 'rgba(71,85,105,.40)'; ctx.lineWidth = 1.0; ctx.stroke();
            });
          };
        } else if (effect === 'clouds') {
          const clouds = Array.from({ length: 10 }, () => ({
            x: rand(0, W), y: rand(H * 0.05, H * 0.7), w: rand(120, 280), speed: rand(0.08, 0.4), op: rand(0.08, 0.28), drift: rand(-0.3, 0.3)
          }));
          loopStateRef.current.renderFn = function(t) {
            paintBase();
            const isDark = themeRef.current === 'dark';
            clouds.forEach(c => {
              c.x += c.speed + Math.sin(t * 0.0001 + c.drift) * 0.1;
              if (c.x - c.w > W) c.x = -c.w;
              const fillCol = isDark ? '148,163,184' : '100,116,139';
              const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
              grad.addColorStop(0, `rgba(${fillCol},${c.op})`); grad.addColorStop(0.5, `rgba(${fillCol},${c.op * 0.5})`); grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad; ctx.beginPath(); ctx.ellipse(c.x, c.y, c.w, c.w * 0.4, 0, 0, 7); ctx.fill();
              const grad2 = ctx.createRadialGradient(c.x - c.w * 0.3, c.y - c.w * 0.15, 0, c.x - c.w * 0.3, c.y - c.w * 0.15, c.w * 0.7);
              grad2.addColorStop(0, `rgba(${fillCol},${c.op * 0.7})`); grad2.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad2; ctx.beginPath(); ctx.ellipse(c.x - c.w * 0.3, c.y - c.w * 0.15, c.w * 0.7, c.w * 0.3, 0, 0, 7); ctx.fill();
              const grad3 = ctx.createRadialGradient(c.x + c.w * 0.3, c.y + c.w * 0.1, 0, c.x + c.w * 0.3, c.y + c.w * 0.1, c.w * 0.6);
              grad3.addColorStop(0, `rgba(${fillCol},${c.op * 0.5})`); grad3.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad3; ctx.beginPath(); ctx.ellipse(c.x + c.w * 0.3, c.y + c.w * 0.1, c.w * 0.6, c.w * 0.3, 0, 0, 7); ctx.fill();
            });
          };
        } else if (effect === 'net') {
          const pts = Array.from({ length: 75 }, () => ({
            x: rand(0, W), y: rand(0, H), vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4), r: rand(1.5, 3.8)
          }));
          let time = 0;
          loopStateRef.current.renderFn = function() {
            time += 0.005;
            paintBase();
            const isDark = themeRef.current === 'dark';
            pts.forEach(p => {
              p.x += p.vx + Math.sin(time + p.x * 0.001) * 0.15; p.y += p.vy + Math.cos(time + p.y * 0.001) * 0.15;
              if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
              p.x = Math.max(0, Math.min(W, p.x)); p.y = Math.max(0, Math.min(H, p.y));
            });
            for (let i = 0; i < pts.length; i++) {
              for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 140) {
                  const alpha = (1 - d / 140) * (isDark ? 0.35 : 0.08);
                  const width = 0.8 + (1 - d / 140) * (isDark ? 0.8 : 0.4);
                  ctx.strokeStyle = isDark ? `rgba(6,182,212,${alpha})` : `rgba(37,99,235,${alpha * 0.4})`;
                  ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                }
              }
            }
            pts.forEach(p => {
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
              if (isDark) {
                grad.addColorStop(0, 'rgba(124,58,237,.8)'); grad.addColorStop(0.4, 'rgba(124,58,237,.4)');
              } else {
                grad.addColorStop(0, 'rgba(37,99,235,.15)'); grad.addColorStop(0.4, 'rgba(37,99,235,.06)');
              }
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 7); ctx.fill();
              ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
              ctx.fillStyle = isDark ? 'rgba(255,255,255,.9)' : 'rgba(30,41,59,.35)'; ctx.fill();
            });
          };
        }
      }
    }
  };

  const handleToggleAuto = () => {
    setIsAuto(!isAuto);
  };

  return (
    <>
      {/* Canvas for rendering background animations */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen z-0 block pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Light Radial Overlay for vignette depth */}
      <div 
        className="fixed inset-0 z-1 pointer-events-none transition-all duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(241,245,249,0.06),rgba(241,245,249,0.50)_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(3,7,18,0.12),rgba(3,7,18,0.60)_70%)]" 
      />
    </>
  );
}

